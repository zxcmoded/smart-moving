using NUnit.Framework;
using Should;
using SmartMoving.Core.Extensions;
using SpecsFor.StructureMap;

namespace SmartMoving.IntegrationSpecs.SmartMoving.Core.Extensions
{
    public class DecimalExtensionSpecs
    {
        public class WhenFormattingAsCurrencyToStripTrailingZeros : SpecsFor<object>
        {
            [Test]
            public void ThenItHandlesDecimals0To2()
            {
                123m.FormatAsCurrency(precision: 4).ShouldEqual("$123.00");
            }

            [Test]
            public void ThenItHandlesDecimals1To2()
            {
                123.1m.FormatAsCurrency(precision: 4).ShouldEqual("$123.10");
            }

            [Test]
            public void ThenItHandlesDecimals2To2()
            {
                123.10m.FormatAsCurrency(precision: 4).ShouldEqual("$123.10");
            }

            [Test]
            public void ThenItHandlesDecimals3To2()
            {
                123.100m.FormatAsCurrency(precision: 4).ShouldEqual("$123.10");
            }

            [Test]
            public void ThenItHandlesDecimals4To2()
            {
                123.1000m.FormatAsCurrency(precision: 4).ShouldEqual("$123.10");
            }

            [Test]
            public void ThenItHandlesDecimals4To3()
            {
                123.0010m.FormatAsCurrency(precision: 4).ShouldEqual("$123.001");
            }

            [Test]
            public void ThenItHandlesDecimals4()
            {
                123.0001m.FormatAsCurrency(precision: 4).ShouldEqual("$123.0001");
            }
        }

        public class WhenFormattingAsCurrencyWithNullValue : SpecsFor<object>
        {
            [Test]
            public void ThenItHandlesZeroAsNumberParamFalse()
            {
                (null as decimal?).FormatAsCurrency(false).ShouldEqual("--");
            }

            [Test]
            public void ThenItHandlesZeroAsNumberParamTrue()
            {
                (null as decimal?).FormatAsCurrency(true).ShouldEqual("$0.00");
            }
        }

        public class WhenFormattingAsCurrencyWith0Value : SpecsFor<object>
        {
            [Test]
            public void ThenItHandlesZeroAsNumberParamFalse()
            {
                0m.FormatAsCurrency(false).ShouldEqual("--");
            }

            [Test]
            public void ThenItHandlesZeroAsNumberParamTrue()
            {
                0m.FormatAsCurrency(true).ShouldEqual("$0.00");
            }
        }

        public class WhenRemovingTrailingZeros : SpecsFor<object>
        {
            [TestCase("4.5560", false, "4.556"),
             TestCase("4.5560", true, "4.556"),
             TestCase("3.330", false, "3.33"),
             TestCase("3.330", true, "3.33"),
             TestCase("2.500", false, "2.5"),
             TestCase("2.500", true, "2.50"),
             TestCase("1.0000", false, "1"),
             TestCase("1.0000", true, "1.00"),
             TestCase("0", false, "0")]
            public void ThenItFormatsTheNumberProperly(string numberToParse, bool preserve2Decimals, string expectedResult)
            {
                numberToParse.RemoveTrailingZeros(preserve2Decimals).ShouldEqual(expectedResult);
            }
        }

        // note: can't use decimal in TestCase, hence individual specs
        public class WhenFormattingAsPercentWithoutTrailingZeros : SpecsFor<object>
        {
            [Test]
            public void ThenItFormats4DecimalsProperly()
            {
                0.0455630m.FormatAsPercentWithoutTrailingZeros().ShouldEqual("4.5563%");
            }
            
            [Test]
            public void ThenItFormats2DecimalsProperly()
            {
                0.03330m.FormatAsPercentWithoutTrailingZeros().ShouldEqual("3.33%");
            }
            
            [Test]
            public void ThenItFormats1DecimalProperly()
            {
                0.02500m.FormatAsPercentWithoutTrailingZeros().ShouldEqual("2.5%");
            }
            
            [Test]
            public void ThenItFormatsWholeDigitsProperly()
            {
                0.01000m.FormatAsPercentWithoutTrailingZeros().ShouldEqual("1%");
            }
        }

        public class WhenRoundingToArbitraryValues : SpecsFor<object>
        {
            [TestCase(12345.23, 1, 12345),
             TestCase(12345.23, 10, 12350),
             TestCase(12345.23, 100, 12300),
             TestCase(12355.23, 100, 12400),
             TestCase(12312.23, 250, 12250),
             TestCase(12395.23, 250, 12500),
             TestCase(12900.23, 250, 13000),
             TestCase(12355.23, 500, 12500),
             TestCase(12655.23, 500, 12500),
             TestCase(12755.23, 500, 13000),
             TestCase(12155.23, 1000, 12000),
             TestCase(12755.23, 1000, 13000)]
            public void ThenItRoundsToTheCorrectAmount(decimal value, int nearestAmount, decimal expectedResult)
            {
                value.RoundToNearest(nearestAmount).ShouldEqual(expectedResult, $"Incorrect rounding {value} to {nearestAmount}.  Expected {expectedResult}, but got {value.RoundToNearest(nearestAmount)}");
            }
        }
        
        public class WhenRoundingUpToArbitraryValues : SpecsFor<object>
        {
            [TestCase(12345.23, 1, 12346),
             TestCase(12341.23, 10, 12350),
             TestCase(12345.23, 100, 12400),
             TestCase(12355.23, 100, 12400),
             TestCase(12312.23, 250, 12500),
             TestCase(12395.23, 250, 12500),
             TestCase(12900.23, 250, 13000),
             TestCase(12355.23, 500, 12500),
             TestCase(12655.23, 500, 13000),
             TestCase(12755.23, 500, 13000),
             TestCase(12155.23, 1000, 13000),
             TestCase(12755.23, 1000, 13000)]
            public void ThenItRoundsToTheCorrectAmount(decimal value, int nearestAmount, decimal expectedResult)
            {
                value.RoundToNearest(nearestAmount, DecimalRounding.Up).ShouldEqual(expectedResult, $"Incorrect rounding {value} to {nearestAmount}.  Expected {expectedResult}, but got {value.RoundToNearest(nearestAmount)}");
            }
        }
        
        public class WhenRoundingDownToArbitraryValues : SpecsFor<object>
        {
            [TestCase(12345.99, 1, 12345),
             TestCase(12345.23, 10, 12340),
             TestCase(12345.23, 100, 12300),
             TestCase(12355.23, 100, 12300),
             TestCase(12312.23, 250, 12250),
             TestCase(12395.23, 250, 12250),
             TestCase(12900.23, 250, 12750),
             TestCase(12355.23, 500, 12000),
             TestCase(12655.23, 500, 12500),
             TestCase(12755.23, 500, 12500),
             TestCase(12155.23, 1000, 12000),
             TestCase(12755.23, 1000, 12000)]
            public void ThenItRoundsToTheCorrectAmount(decimal value, int nearestAmount, decimal expectedResult)
            {
                value.RoundToNearest(nearestAmount, DecimalRounding.Down).ShouldEqual(expectedResult, $"Incorrect rounding {value} to {nearestAmount}.  Expected {expectedResult}, but got {value.RoundToNearest(nearestAmount)}");
            }
        }
    }
}
