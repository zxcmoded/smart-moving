using System;
using Microsoft.AspNetCore.Mvc;

namespace SmartMoving.Api.Infrastructure
{
    [AttributeUsage(AttributeTargets.Class, AllowMultiple = false)]
    public class StandardRouteAttribute : RouteAttribute
    {
        public StandardRouteAttribute() : base("api/[controller]")
        {
            
        }

        public StandardRouteAttribute(string baseRoute) : base($"api/{baseRoute}")
        {
            
        }
    }
}