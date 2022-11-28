using SmartMoving.Api.Infrastructure.Startup;
using SmartMoving.Core.Data.Core;

namespace SmartMoving.Api.Features.Common
{
    public class AddressModel : IMapFrom<Address>, IMapTo<Address>
    {
        public string Street { get; set; }

        public string City { get; set; }

        public string State { get; set; }

        public string ZipCode { get; set; }

        public string FullAddress => Address.FormatFromComponents(Street, City, State, ZipCode);
    }
}
