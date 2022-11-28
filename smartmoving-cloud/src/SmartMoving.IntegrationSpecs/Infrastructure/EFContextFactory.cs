using System;
using System.Linq;
using System.Reflection;
using JetBrains.Annotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using SmartMoving.Core;
using SmartMoving.Data.Contexts;
using SpecsFor.StructureMap;

namespace SmartMoving.IntegrationSpecs.Infrastructure
{
    public class EFContextFactory : SmartMovingBehavior<INeedDatabase>
    {
        private static string _appSettings;

        [UsedImplicitly]
        private void InitializeEFContext<TSut>(INeedDatabase instance) where TSut : class
        {
            var config = new ConfigurationBuilder().AddJsonFile(GetAppSettings()).Build();

            ConfigureAppDbContext<TSut>(instance, config);
        }

        private static void ConfigureAppDbContext<TSut>(INeedDatabase instance, IConfigurationRoot config) where TSut : class
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                          .UseSqlServer(config.GetConnectionString("DefaultConnection"))
                          .EnableSensitiveDataLogging()
                          .Options;

            var autoMocker = (StructureMapAutoMocker<TSut>)instance.Mocker;

            autoMocker.MoqAutoMocker.Container.Configure(x =>
            {
                x.For<DbContextOptions<AppDbContext>>().Use(options);
                x.For<ICurrentUser>().Use(new AnonymousUser());
            });

            instance.Context = autoMocker.MoqAutoMocker.Container.GetInstance<AppDbContext>();
            instance.Context.RemoveCompanyFilter();
            instance.Context.IsRunningIntegrationSpecs = true;

            autoMocker.MoqAutoMocker.Container.Configure(x => { x.For<AppDbContext>().Use(instance.Context); });
        }

        public override void SpecInit(INeedDatabase instance)
        {
            CallMethod(instance, "InitializeEFContext");
        }

        public override void AfterGiven(INeedDatabase instance)
        {
            if (GetSUTType(instance).GetCustomAttributes().Any(x => x.GetType() == typeof(AllowAnonymousAttribute)))
            {
                instance.Context.RemoveCompanyFilter();
            }
        }

        public override void AfterSpec(INeedDatabase instance)
        {
            instance.Context.Dispose();
        }

        private static string GetAppSettings()
        {
            if (!string.IsNullOrWhiteSpace(_appSettings))
            {
                return _appSettings;
            }

            var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

            if (string.IsNullOrEmpty(environment))
            {
                _appSettings = "appsettings.json";
                return _appSettings;
            }

            _appSettings = $"appsettings.{environment}.json";
            return _appSettings;
        }
    }
}