using System;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using NLog.Web;
using SmartMoving.Api.Infrastructure;
using StructureMap;

namespace SmartMoving.Api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            // ASPNETCORE_ENVIRONMENT
            //  Local - no Sumo logging
            //  Development - Log Info and above
            //  Production - Log Warn and above

            var logConfig = "NLog.Development.config";

            var environmentLogConfig = $"NLog.{Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")}.config";

            if (File.Exists(environmentLogConfig))
            {
                logConfig = environmentLogConfig;
            }

            var logger = NLogBuilder.ConfigureNLog(logConfig).GetCurrentClassLogger();

            try
            {
                logger.Debug("Creating web host...");
                CreateWebHostBuilder(args).Build().Run();
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine("The web host has terminated unexpectedly: \r\n" + ex);
                logger.Fatal(ex, "The web host has terminated unexpectedly.");
            }
            finally
            {
                NLog.LogManager.Shutdown();
            }
        }

        public static IHostBuilder CreateWebHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .UseServiceProviderFactory(new StructureMapServiceProviderFactory(new DefaultRegistry()))
                .ConfigureWebHostDefaults(x =>
                {
                    x.UseSetting("detailedErrors", "true")
                     .UseStartup<Startup>()
                     .CaptureStartupErrors(true)
                     .ConfigureLogging(logging =>
                     {
                         logging.ClearProviders();
                         logging.SetMinimumLevel(LogLevel.Trace);
                     })
                     .UseNLog();
                });
    }
}