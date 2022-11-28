using AutoMapper;
using SmartMoving.Api.Infrastructure.Startup;
using SmartMoving.Api.Features.Common;

namespace SmartMoving.Api.Features.Settings.Company
{
    public class CompanySettingsModel : IMapFrom<Core.Data.Core.Company>, IMapTo<Core.Data.Core.Company>, IHaveCustomMappings
    {
        public string PhoneNumber { get; set; }

        public string StateLicenseNumber { get; set; }

        public AddressModel Address { get; set; }

        public string WebsiteAddress { get; set; }

        public string CustomerPortalUrl { get; set; }

        public string SmsNumber { get; set; }

        public string IanaTzdbTimeZone { get; set; }

        public void CreateMappings(IProfileExpression configuration)
        {
            configuration.CreateMap<CompanySettingsModel, Core.Data.Core.Company>()
                .ForMember(x => x.SmsNumber, opt => opt.Ignore());
        }
    }
}
