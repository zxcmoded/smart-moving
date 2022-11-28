using System.Linq;
using System.Text;
using SmartMoving.Core.Extensions;

namespace SmartMoving.Core.Data.Core
{
    // This is an "owned" type.  It is not a first-class citizen in the domain.
    public class Address
    {
        public string Street { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set; }

        public void NormalizeEverything()
        {
            Street = Street?.Left(100);
            City = City?.Left(100);
            State = State?.Left(100);
            ZipCode = ZipCode?.Left(100);
        }

        public override string ToString()
        {
            return FormatFromComponents(Street, City, State, ZipCode);
        }

        public static string FormatFromComponents(string street, string city, string state, string zipCode, string unit = null)
        {
            var result = new StringBuilder();

            result.Append(GetUnit(unit));

            if (!string.IsNullOrWhiteSpace(street))
            {
                result.Append(street);
            }

            if (!string.IsNullOrWhiteSpace(city))
            {
                result.Append(result.Length > 0 ? $" {city}" : city);
            }

            if (result.Length > 0 && (!string.IsNullOrWhiteSpace(state) || !string.IsNullOrWhiteSpace(zipCode)))
            {
                result.Append(", ");
            }

            result.Append((new[] { state, zipCode }).JoinNonNullEntries(" "));

            return result.ToString();
        }

        public static string GetUnit(string unit)
        {
            if (string.IsNullOrWhiteSpace(unit))
            {
                return string.Empty;
            }

            return $"Unit {unit}, ";
        }

        public bool IsPopulated()
        {
            return !new[]
            {
                Street,
                City,
                State,
                ZipCode,
            }.Any(string.IsNullOrWhiteSpace);
        }
    }
}