using System;
using NUnit.Framework;
using SmartMoving.IntegrationSpecs.Infrastructure;
using SpecsFor.Core.Configuration;
using SpecsFor.Core.ShouldExtensions;

namespace SmartMoving.IntegrationSpecs
{
    [SetUpFixture]
    public class IntegrationSpecsConfig : SpecsForConfiguration
    {
        public IntegrationSpecsConfig()
        {
            Some.DefaultDateTimeTolerance = TimeSpan.FromSeconds(30);

            WhenTestingAnything().EnrichWith<AddStructureMapRegistries>();
            WhenTestingAnything().EnrichWith<AutoMapperConfig>();

            WhenTesting<INeedDatabase>().EnrichWith<EFContextFactory>();
            WhenTesting<INeedDatabase>().EnrichWith<EnsureSchema>();
            WhenTesting<ICurrentUserAdmin>().EnrichWith<CurrentUserAdmin>();
            WhenTesting<ICurrentUserCustomer>().EnrichWith<CurrentUserCustomer>();
            WhenTesting<ICurrentUserNormal>().EnrichWith<CurrentUserNormal>();
            WhenTesting<ICurrentUserNormalFullPermissions>().EnrichWith<CurrentUserNormalFullPermissions>();
            WhenTesting<INeedDatabase>().EnrichWith<TransactionScopeWrapper>();
            WhenTesting<INeedControllerPropertiesMocked>().EnrichWith<ControllerPropertiesMocker>();
            WhenTesting<INeedMemoryCache>().EnrichWith<MemoryCacheFactory>();
        }
    }
}