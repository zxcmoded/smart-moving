using System.Threading.Tasks;
using SpecsFor.StructureMap;

namespace SmartMoving.IntegrationSpecs
{
    public abstract class SpecsForAsync<TSut> : SpecsFor<TSut> where TSut : class
    {
        protected override void When() => WhenAsync().GetAwaiter().GetResult();
        protected virtual Task WhenAsync()
        {
            return Task.CompletedTask;
        }

        protected override void Given() => GivenAsync().GetAwaiter().GetResult();
        protected virtual Task GivenAsync()
        {
            return Task.CompletedTask;
        }
    }
}
