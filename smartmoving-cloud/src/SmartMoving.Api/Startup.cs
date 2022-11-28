using System.Runtime.CompilerServices;
using JetBrains.Annotations;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using NLog;
using SmartMoving.Api.Infrastructure.Startup;
using SmartMoving.Core.Startup;
using StructureMap;

[assembly: InternalsVisibleTo("SmartMoving.IntegrationSpecs")]

namespace SmartMoving.Api
{
    public class Startup
    {
        private static readonly Logger Logger = LogManager.GetCurrentClassLogger();

        public static Container Container { get; } = new Container();

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        [UsedImplicitly]
        public void ConfigureServices(IServiceCollection services)
        {
            services.ConfigureLogging(Configuration.GetConnectionString("DefaultConnection"));

            services.AddMemoryCache();

            services.AddMvcWithAuth(Configuration);

            services.AddDataAccess(Configuration);

            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            services.AddHeroicAutoMapper<SmartMovingHeroicAutoMapperProfile>();

            services.ConfigureWithStructureMap(Container);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        [UsedImplicitly]
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.Use(async (context, next) =>
            {
                await next.Invoke();

                if (context.Response.StatusCode == StatusCodes.Status401Unauthorized)
                {
                    Logger.Debug($"401 encountered: {Microsoft.AspNetCore.Http.Extensions.UriHelper.GetDisplayUrl(context.Request)}");
                }
            });

            app.UseMvcWithAppSettings(env);
            app.ExecuteStartupTasks(Container);
        }
    }
}