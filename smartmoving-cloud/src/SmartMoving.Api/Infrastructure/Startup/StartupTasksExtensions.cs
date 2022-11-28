using System;
using System.Diagnostics;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using NLog;
using SmartMoving.Api.Data;
using SmartMoving.Core.Data.Core;
using SmartMoving.Core.Data.Security;
using SmartMoving.Data;
using SmartMoving.Data.Contexts;
using StructureMap;

namespace SmartMoving.Api.Infrastructure.Startup
{
    public static class StartupTasksExtensions
    {
        private static readonly Logger Logger = LogManager.GetCurrentClassLogger();

        public static void ExecuteStartupTasks(this IApplicationBuilder app, IContainer rootContainer)
        {
            using var nestedContainer = rootContainer.GetNestedContainer();

            var stopwatch = Stopwatch.StartNew();
            var context = nestedContainer.GetInstance<AppDbContext>();
            Logger.Info($"Getting first AppDbContext took {stopwatch.Elapsed.TotalSeconds} seconds.");

            SetupDatabase(context, nestedContainer);
        }

        public static void SetupDatabase(AppDbContext context, IContainer nestedContainer)
        {
            context.SkipInitialMigrationIfDatabaseAlreadyExists();
            context.RemoveCompanyFilter();

            context.Database.Migrate();

            context.RunOtherScripts();

            EnsureSystemCompanyData(context);

            var seedDataInitializer = nestedContainer.GetInstance<CompanyDataInitializer>();
            seedDataInitializer.Execute(CompanyCreationSettings.DemoCompanySettings).Wait();
        }

        private static void EnsureSystemCompanyData(AppDbContext context)
        {
            if (!context.Companies.WithReadUncommitted(context).AnySync(x => x.Name == "SmartMoving System"))
            {
                context.Companies.Add(new Company
                {
                    Id = Company.SystemCompanyId,
                    Name = "SmartMoving System",
                    // This is our shared "production" number. Should be fine for the system account.
                    SmsNumber = "+5555551234",
                });

                context.SaveChanges();
            }

            if (!context.Users.WithReadUncommitted(context).AnySync(x => x.Email == "system@smartmoving.com"))
            {
                var user = new AppUser
                {
                    Id = AppUser.SystemUserId,
                    UserName = "system@smartmoving.com",
                    Email = "system@smartmoving.com",
                    EmailConfirmed = true,
                    DisplayName = "System User",
                    CompanyId = Company.SystemCompanyId
                };

                context.Users.Add(user);

                context.SaveChanges();
            }

            if (!context.Users.WithReadUncommitted(context).AnySync(x => x.Email == "no-reply+customer@smartmoving.com"))
            {
                var user = new AppUser
                {
                    Id = AppUser.CustomerUserId,
                    UserName = "no-reply+customer@smartmoving.com",
                    Email = "no-reply+customer@smartmoving.com",
                    EmailConfirmed = true,
                    DisplayName = "Customer",
                    CompanyId = Company.SystemCompanyId
                };

                context.Users.Add(user);

                context.SaveChanges();
            }
        }
    }
}