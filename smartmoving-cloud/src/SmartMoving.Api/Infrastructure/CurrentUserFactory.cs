using Microsoft.AspNetCore.Http;
using SmartMoving.Core;
using StructureMap;

namespace SmartMoving.Api.Infrastructure
{
    public static class CurrentUserFactory
    {
        public static ICurrentUser GetCurrentUser(IContext context)
        {
            var httpContext = context.GetInstance<IHttpContextAccessor>()?.HttpContext;

            if (httpContext?.User?.Identity.IsAuthenticated != true)
            {
                return new AnonymousUser();
            }
            else
            {
                return context.GetInstance<CurrentUser>();
            }
        }
    }
}