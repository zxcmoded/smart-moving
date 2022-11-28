using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using NLog;

namespace SmartMoving.Api.Features.Common
{
    public abstract class SmartMovingController : Controller
    {
        private static readonly Logger Logger = LogManager.GetCurrentClassLogger();

        private void LogBadRequest(string errorMessage = null, bool logInfo = false)
        {
            var requestUri = Request?.GetDisplayUrl();

            // NLog's LogLevel isn't actually an enum, so can't use it as a default parameter, and didn't want to pull in
            // MS's Extensions.Logging packages right now.

            var log = $"Bad request made to {requestUri}.  {errorMessage}";

            if (logInfo)
            {
                Logger.Info(log);
            }
            else
            {
                Logger.Warn(log);
            }
        }

        [NonAction]
        public new BadRequestObjectResult BadRequest()
        {
            LogBadRequest();

            return new BadRequestObjectResult(new BadRequestModel {Message = "There was a problem with your request."});
        }

        [NonAction]
        public BadRequestObjectResult NotFoundBadRequest(string entity, string additionalInfo = null)
        {
            additionalInfo = !string.IsNullOrWhiteSpace(additionalInfo) ? $" {additionalInfo}" : additionalInfo;
            return BadRequest($"The specified {entity} was not found.{additionalInfo}", logInfo: true);
        }

        [NonAction]
        public BadRequestObjectResult BadRequest(string error, bool logInfo = false)
        {
            LogBadRequest($"Bad request received: {error}", logInfo);

            return new BadRequestObjectResult(new BadRequestModel { Message = error });
        }
    }
}
