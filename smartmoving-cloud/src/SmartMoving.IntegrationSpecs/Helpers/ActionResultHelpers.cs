using Microsoft.AspNetCore.Mvc;
using NUnit.Framework;
using Should;
using SmartMoving.Api.Features.Common;

namespace SmartMoving.IntegrationSpecs.Helpers
{
    public static class ActionResultHelpers
    {
        public static T TryGetObjectFromResult<T>(this ActionResult<T> result)
        {
            return result.Result switch
            {
                OkObjectResult okObjectResult => (T)okObjectResult?.Value,
                CreatedResult createdResult => (T)createdResult?.Value,
                OkResult _ => default,
                _ => throw new System.NotSupportedException($"Not supported for type {result.Result.GetType()}")
            };
        }
        
        public static void ShouldBeBadRequestObjectResultWithMessage(this ActionResult result, string expectedMessage)
        {
            var actualMessage = ((result as BadRequestObjectResult)?.Value as BadRequestModel)?.Message;

            if (actualMessage == null)
            {
                Assert.Fail("ActionResult was not of type BadRequestObjectResult.");
            }
                
            actualMessage.ShouldEqual(expectedMessage);
        }
        
        public static void ShouldBeBadRequestObjectResultWithMessageContaining(this ActionResult result, string expectedMessage)
        {
            var actualMessage = ((result as BadRequestObjectResult)?.Value as BadRequestModel)?.Message;

            if (actualMessage == null)
            {
                Assert.Fail("ActionResult was not of type BadRequestObjectResult.");
            }
                
            actualMessage.ShouldContain(expectedMessage);
        }

        public static void CreatedLocationShouldEqual<T>(this ActionResult<T> result, string expectedLocation)
        {
            var actualLocation = (result?.Result as CreatedResult)?.Location;

            if (string.IsNullOrWhiteSpace(actualLocation))
            {
                Assert.Fail("Location was null or whitespace.");
            }
            
            actualLocation.ShouldEqual(expectedLocation);
        }
    }
}
