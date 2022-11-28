using System;
using Microsoft.Extensions.DependencyInjection;
using StructureMap;

namespace SmartMoving.Api.Infrastructure.Startup
{
    public static class StructureMapStartupExtensions
    {
        public static void ConfigureWithStructureMap(this IServiceCollection services, IContainer container)
        {
            container.Configure(cfg =>
            {
                cfg.AddRegistry<DefaultRegistry>();

                cfg.Populate(services);
            });

            services.AddSingleton<IServiceProviderFactory<Registry>>(new StructureMapServiceProviderFactory(new DefaultRegistry()));
        }
    }
}
