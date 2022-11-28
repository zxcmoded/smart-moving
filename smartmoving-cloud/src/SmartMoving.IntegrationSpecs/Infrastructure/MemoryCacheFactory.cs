using Microsoft.Extensions.Caching.Memory;
using SmartMoving.IntegrationSpecs.Helpers;
using SpecsFor.Core;

namespace SmartMoving.IntegrationSpecs.Infrastructure
{
    public interface INeedMemoryCache : ISpecs
    {

    }

    public class MemoryCacheFactory : SmartMovingBehavior<INeedMemoryCache>
    {
        public override void SpecInit(INeedMemoryCache instance)
        {
            instance.GetMockContainer().Configure(cfg =>
            {
                cfg.For<IMemoryCache>().Use(() => new MemoryCache(new MemoryCacheOptions()));
            });
        }
    }
}
