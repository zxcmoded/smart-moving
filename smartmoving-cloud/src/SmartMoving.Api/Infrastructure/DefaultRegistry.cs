using SmartMoving.Api.Data;
using SmartMoving.Api.Features.Authentication;
using SmartMoving.Core;
using SmartMoving.Core.Data.Core;
using StructureMap;

namespace SmartMoving.Api.Infrastructure
{
    public class DefaultRegistry : Registry
    {
        public DefaultRegistry()
        {
            Scan(scan =>
            {
                scan.WithDefaultConventions();
                scan.TheCallingAssembly();
                scan.LookForRegistries();

                scan.AssemblyContainingType<Customer>();
                scan.AssemblyContainingType<AuthenticationController>();
                scan.AssembliesFromApplicationBaseDirectory(x => x.FullName.StartsWith("SmartMoving"));
            });

            For<ICurrentUser>().Use(ctx => CurrentUserFactory.GetCurrentUser(ctx));
            ForConcreteType<CompanyDataInitializer>();
        }
    }
}