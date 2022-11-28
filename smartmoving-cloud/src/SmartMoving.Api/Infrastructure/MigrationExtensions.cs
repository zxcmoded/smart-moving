using System;
using SystemSql = System.Data.SqlClient;
using MicrosoftSql = Microsoft.Data.SqlClient;
using System.IO;
using System.Linq;
using Dapper;
using Microsoft.EntityFrameworkCore;
using SmartMoving.Data.Contexts;

namespace SmartMoving.Api.Infrastructure
{
    public static class MigrationExtensions
    {
        public static void SkipInitialMigrationIfDatabaseAlreadyExists(this AppDbContext context)
        {
            try
            {
                var connection = context.Database.GetDbConnection();

                var initialMigrationAlreadyApplied = connection.QuerySingle<int?>("SELECT OBJECT_ID('Core.Customers')").HasValue;

                if (initialMigrationAlreadyApplied)
                {
                    var parameters = new
                    {
                        MigrationId = "20210101111111_Initial",
                        ProductVersion = "2.2.4-servicing-10062"
                    };

                    if (!connection.QuerySingleOrDefault<int?>(
                                       $"SELECT 1 FROM dbo.__EFMigrationsHistory WHERE MigrationId = '{parameters.MigrationId}'")
                                   .HasValue)
                    {
                        connection.Execute(
                            "INSERT INTO dbo.__EFMigrationsHistory(MigrationId, ProductVersion) VALUES(@MigrationId, @ProductVersion)",
                            parameters);
                    }
                }
            }
            catch (Exception ex) when (ex is SystemSql.SqlException or MicrosoftSql.SqlException && ex.Message.Contains("Cannot open database"))
            {
                // Database doesn't exist and needs to be migrated. 
                return;
            }
        }

        public static void RunOtherScripts(this AppDbContext context)
        {
            var dataAssembly = typeof(AppDbContext).Assembly;

            var scripts = dataAssembly.GetManifestResourceNames()
                                      .Where(x => x.EndsWith(".sql", StringComparison.CurrentCultureIgnoreCase))
                                      .ToArray();

            // We need to make sure our Index scripts are ran in sequential order.
            foreach (var indexScript in scripts.Where(x => x.Contains("Indexes")).OrderBy(x => x))
            {
                RunScript(indexScript);
            }

            // Update Views first, then Sprocs.
            foreach (var otherScript in scripts.Where(x => !x.Contains("Indexes")).OrderBy(x => x.Contains("View") ? 0 : 1))
            {
                RunScript(otherScript);
            }

            void RunScript(string script)
            {
                using var stream = dataAssembly.GetManifestResourceStream(script);
                using var streamReader = new StreamReader(stream);
                var scriptBody = streamReader.ReadToEnd();

                var batches = scriptBody.Split("\r\nGO\r\n");

                foreach (var batch in batches.Where(x => !string.IsNullOrEmpty(x.Trim())))
                {
                    try
                    {
                        context.Database.ExecuteSqlRaw(batch);
                    }
                    catch (Exception exception)
                    {
                        throw new Exception($"Error in {script}. Make sure it ends with a blank newline or two.", exception);
                    }
                }
            }
        }
    }
}