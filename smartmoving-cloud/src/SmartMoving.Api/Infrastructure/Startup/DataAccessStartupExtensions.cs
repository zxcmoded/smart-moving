using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SmartMoving.Api.Infrastructure.SqlErrorHandling;
using SmartMoving.Data.Contexts;

namespace SmartMoving.Api.Infrastructure.Startup
{
    public static class DataAccessStartupExtensions
    {
        public static void AddDataAccess(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<AppDbContext>(options =>
            {
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"), x =>
                       {
                           x.MigrationsAssembly("SmartMoving.Data");
                           x.ExecutionStrategy(c => new CustomSqlServerRetryingExecutionStrategy(c));
                           x.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery);
                       })
                       .EnableSensitiveDataLogging();
            });
        }
    }
}