using NUnit.Framework;
using Should;
using SmartMoving.Core.Data.Core;

namespace SmartMoving.IntegrationSpecs.SmartMoving.Core.Data.Core
{
    public class AddressSpecs
    {
        public class WhenCheckingIfAddressIsFullyPopulated : SpecsForAsync<Address>
        {
            [TestCase("Test", "Test", "Test", "Test", true),
             TestCase("", "", "", "", false),
             TestCase(null, null, null, null, false),
             TestCase("", "Test", "Test", "Test", false),
             TestCase("Test", "", "Test", "Test", false),
             TestCase("Test", "Test", "", "Test", false),
             TestCase("Test", "Test", "Test", "", false)]
            public void ThenItReturnsTheExpectedResults(string street, string city, string state, string zipCode, bool expectedResult)
            {
                SUT = new Address
                {
                    Street = street,
                    City = city,
                    State = state,
                    ZipCode = zipCode
                };

                SUT.IsPopulated().ShouldEqual(expectedResult);
            }
        }
    }
}
