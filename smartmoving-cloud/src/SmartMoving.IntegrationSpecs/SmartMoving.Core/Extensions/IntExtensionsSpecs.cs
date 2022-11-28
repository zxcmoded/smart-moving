using NUnit.Framework;
using Should;
using SmartMoving.Core.Extensions;
using SpecsFor.StructureMap;

namespace SmartMoving.IntegrationSpecs.SmartMoving.Core.Extensions
{
    public static class IntExtensionsSpecs
    {
        public class WhenUsingDashIfZeroAndNumberIsZero : SpecsFor<object>
        {
            [Test]
            public void ThenItReturnsDash()
            {
                0.DashIfZero().ShouldEqual("--");
            }
        }

        public class WhenUsingDashIfZeroAndNumberIsNotZero : SpecsFor<object>
        {
            [TestCase(1, "1")]
            [TestCase(10, "10")]
            [TestCase(150, "150")]
            [TestCase(300000, "300000")]
            [TestCase(5000000, "5000000")]
            [TestCase(-2500, "-2500")]
            [TestCase(-25000, "-25000")]
            public void ThenItReturnsExpectedNumber(int number, string expectedResult)
            {
                number.DashIfZero().ShouldEqual(expectedResult);
            }
        }
    }
}