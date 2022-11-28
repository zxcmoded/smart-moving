using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Primitives;
using Moq;

namespace SmartMoving.IntegrationSpecs.Infrastructure
{
    public class ControllerPropertiesMocker : SmartMovingBehavior<INeedControllerPropertiesMocked>
    {
        public override void ClassUnderTestInitialized(INeedControllerPropertiesMocked instance)
        {
            dynamic instanceDynamic = instance;

            var controller = (Controller)instanceDynamic.SUT;

            var httpContext = new DefaultHttpContext
            {
                Request = {Scheme = "https", Host = new HostString("my.request"), PathBase = "/api" }
            };
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = httpContext,
            };

            controller.TempData = new TempDataDictionary(httpContext, instance.Mocker.GetMockFor<ITempDataProvider>().Object);

            if (instance is INeedHttpRequest)
            {
                httpContext.Request.ContentType = "application/x-www-form-urlencoded";
                httpContext.Request.Form = new FormCollection(new Dictionary<string, StringValues>());
            }

            // This won't generate URLs that are exactly like what our routing expects, but it generates something that 
            // we can write specs against. 
            var urlHelperMock = instance.Mocker.GetMockFor<IUrlHelper>();
            urlHelperMock.Setup(x => x.Action(It.IsAny<UrlActionContext>()))
                .Returns((UrlActionContext x) =>
                    $"/{x.Controller}/{x.Action}?"
                    + string.Join("&", new RouteValueDictionary(x.Values).Select(p => p.Key + "=" + p.Value)));

            controller.Url = urlHelperMock.Object;
        }
    }
}
