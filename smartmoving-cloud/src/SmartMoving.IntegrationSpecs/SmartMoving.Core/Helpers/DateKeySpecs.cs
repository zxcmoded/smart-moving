using NUnit.Framework;
using Should;
using SmartMoving.Core.Helpers;
using SpecsFor.StructureMap;

namespace SmartMoving.IntegrationSpecs.SmartMoving.Core.Helpers
{
    public class DateKeySpecs
    {
        public class GetDateKeyWithLeapYearCheck : SpecsFor<object>
        {

            [TestCase(20200101, true, 20200101)] // normal date, leap year doesn't matter, should match
            [TestCase(20200229, false, 20200228)] // feb 29th -> feb 28th, not a leap year
            [TestCase(20200229, true, 20200229)] // feb 29th -> feb 28th, not a leap year
            public void ThenItReturnsDateKeyBasedOnLeapYearLogic(int initialDateKey, bool isLeapYear, int expectedDateKey)
            {
                DateKey.GetDateKeyWithLeapYearCheck(initialDateKey, isLeapYear).ShouldEqual(expectedDateKey);
            }
        }
        
        public class SetLeapYearSafeDateKey : SpecsFor<object>
        {

            [TestCase(20200101, 20200101)] // normal date, should match
            [TestCase(20200229, 20200229)] // feb 29th, save regardless of leap year
            [TestCase(20200228, 20200229)] // feb 28th, always save as feb 29th, regardless of leap year
            public void ThenItReturnsTheValueToSetByLeapYearLogic(int initialDateKey, int expectedDateKey)
            {
                DateKey.SetLeapYearSafeDateKey(initialDateKey).ShouldEqual(expectedDateKey);
            }
        }
    }
}
