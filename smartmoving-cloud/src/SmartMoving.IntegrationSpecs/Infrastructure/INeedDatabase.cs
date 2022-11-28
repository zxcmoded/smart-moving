using SmartMoving.Data.Contexts;
using SpecsFor.Core;

namespace SmartMoving.IntegrationSpecs.Infrastructure
{
    public interface INeedDatabase : ISpecs
    {
        AppDbContext Context { get; set; }
    }
}
