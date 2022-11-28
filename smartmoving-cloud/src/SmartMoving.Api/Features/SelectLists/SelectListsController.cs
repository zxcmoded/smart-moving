using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartMoving.Api.Features.Common;
using SmartMoving.Api.Infrastructure;
using SmartMoving.Core.Data.Core;

namespace SmartMoving.Api.Features.SelectLists
{
    [ApiController,
     StandardRoute("select-lists"),
     Authorize]
    public class SelectListsController : SmartMovingController
    {
        [HttpGet("phone-types"), ResponseCache(Duration = 60 * 10)]
        public ActionResult<SelectListOption[]> PhoneTypes()
        {
            return Ok(SelectListOption.MakeListForEnum<PhoneType>());
        }

        [HttpGet("time-zones"), ResponseCache(Duration = 60 * 10), AllowAnonymous] // Used in prov wiz
        public ActionResult<SelectListOption[]> GetTimeZones()
        {
            return Ok(new[]
            {
                new SelectListOption { Id = "America/Anchorage", Name = "US: America/Anchorage (Alaska)" },
                new SelectListOption { Id = "America/Chicago", Name = "US: America/Chicago (Central)" },
                new SelectListOption { Id = "America/Denver", Name = "US: America/Denver (Mountain)" },
                new SelectListOption { Id = "America/Indiana/Indianapolis", Name = "US: America/Indiana/Indianapolis (Eastern - IN)" },
                new SelectListOption { Id = "America/Los_Angeles", Name = "US: America/Los_Angeles (Pacific)" },
                new SelectListOption { Id = "America/New_York", Name = "US: America/New_York (Eastern)" },
                new SelectListOption { Id = "America/Phoenix", Name = "US: America/Phoenix (Mountain Standard)" },
                new SelectListOption { Id = "Pacific/Honolulu", Name = "US: Pacific/Honolulu (Hawaii)" },

                new SelectListOption { Id = "America/Atikokan", Name = "CA: America/Atikokan (Eastern Standard)" },
                new SelectListOption { Id = "America/Blanc-Sablon", Name = "CA: America/Blanc-Sablon (Atlantic Standard)" },
                new SelectListOption { Id = "America/Creston", Name = "CA: America/Creston (Mountain Standard)" },
                new SelectListOption { Id = "America/Edmonton", Name = "CA: America/Edmonton (Mountain)" },
                new SelectListOption { Id = "America/Halifax", Name = "CA: America/Halifax (Atlantic)" },
                new SelectListOption { Id = "America/Moncton", Name = "CA: America/Moncton (Atlantic w/ early DST)" },
                new SelectListOption { Id = "America/Regina", Name = "CA: America/Regina (Central Standard)" },
                new SelectListOption { Id = "America/St_Johns", Name = "CA: America/St Johns (Newfoundland)" },
                new SelectListOption { Id = "America/Toronto", Name = "CA: America/Toronto (Eastern)" },
                new SelectListOption { Id = "America/Vancouver", Name = "CA: America/Vancouver (Pacific)" },
                new SelectListOption { Id = "America/Winnipeg", Name = "CA: America/Winnipeg (Central)" },
            });
        }
    }
}