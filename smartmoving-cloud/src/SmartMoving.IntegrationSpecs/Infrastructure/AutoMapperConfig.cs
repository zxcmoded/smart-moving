using AutoMapper;
using JetBrains.Annotations;
using SmartMoving.Api.Infrastructure.Startup;
using SpecsFor.Core;
using SpecsFor.StructureMap;

namespace SmartMoving.IntegrationSpecs.Infrastructure
{
    public class AutoMapperConfig : SmartMovingBehavior<ISpecs>
    {
        private static MapperConfiguration _mapperConfig;
        private static IMapper _mapper;

        [UsedImplicitly]
        private void SetupAutoMapper<TSut>(ISpecs instance) where TSut : class
        {
            var mapperConfig = _mapperConfig ?? new MapperConfiguration(cfg => cfg.AddProfile(new SmartMovingHeroicAutoMapperProfile()));
            _mapperConfig = mapperConfig;
            var mapper = _mapper ?? mapperConfig.CreateMapper();
            _mapper = mapper;
            
            var autoMocker = (StructureMapAutoMocker<TSut>) instance.Mocker;
            
            autoMocker.MoqAutoMocker.Container.Configure(x =>
            {
                x.For<MapperConfiguration>().Use(mapperConfig);
                x.For<IMapper>().Use(mapper);
            });

        }

        public override void SpecInit(ISpecs instance)
        {
            CallMethod(instance, "SetupAutoMapper");
        }
    }
}
