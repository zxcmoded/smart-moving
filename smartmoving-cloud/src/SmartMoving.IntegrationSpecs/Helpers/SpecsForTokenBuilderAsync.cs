using System.Collections.Generic;
using SmartMoving.Data;
using SmartMoving.Data.Contexts;
using SmartMoving.IntegrationSpecs.Infrastructure;
using StructureMap;

namespace SmartMoving.IntegrationSpecs.Helpers
{
    public abstract class SpecsForTokenBuilderAsync<T> : SpecsForAsync<T>, ICurrentUserCustomer where T : class
    {
        protected readonly Dictionary<string, string> Tokens = new Dictionary<string, string>();

        public AppDbContext Context { get; set; }

        public override void ConfigureContainer(Container container)
        {
            container.Configure(cfg => cfg.For<Dictionary<string, string>>().Use(Tokens));
        }
    }
}
