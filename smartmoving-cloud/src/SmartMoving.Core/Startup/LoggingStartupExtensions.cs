using System.Linq;
using Microsoft.Extensions.DependencyInjection;
using NLog;
using NLog.Targets;

namespace SmartMoving.Core.Startup
{
    public static class LoggingStartupExtensions
    {
        public static void ConfigureLogging(this IServiceCollection services, string connectionString)
        {
            var dbTarget = LogManager.Configuration.AllTargets.OfType<DatabaseTarget>().Single();
            dbTarget.ConnectionString = connectionString;
            LogManager.ReconfigExistingLoggers();
        }
    }
}