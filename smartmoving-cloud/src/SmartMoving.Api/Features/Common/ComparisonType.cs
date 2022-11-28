using System.ComponentModel;
using System.Globalization;
using System.Runtime.Serialization;
using Newtonsoft.Json;

namespace SmartMoving.Api.Features.Common
{
    [TypeConverter(typeof(CustomEnumConverter<ComparisonType>))]
    public enum ComparisonType
    {
        [EnumMember(Value="=")]
        Equal,
        [EnumMember(Value="!=")]
        NotEqual,
        [EnumMember(Value=">")]
        GreaterThan,
        [EnumMember(Value=">=")]
        GreaterThanOrEqualTo,
        [EnumMember(Value="<")]
        LessThan,
        [EnumMember(Value="<=")]
        LessThanOrEqualTo,
        [EnumMember(Value="*")]
        Search,
    }

    public class CustomEnumConverter<T> : TypeConverter
    {
        // EnumMember alone works fine for most situations - however, when using ApiController model validation always automatically happens.
        // Apparently, when using HttpGet, that validation does not use JsonConvert, so it ends up saying they're invalid, and your controller
        // action is never even hit.
        public override object ConvertFrom(ITypeDescriptorContext context, CultureInfo culture, object value)
        {
            var s = value as string;
            if (string.IsNullOrEmpty(s))
            {
                return null;
            }

            return JsonConvert.DeserializeObject<T>(@"""" + value.ToString() + @"""");
        }
    }
}