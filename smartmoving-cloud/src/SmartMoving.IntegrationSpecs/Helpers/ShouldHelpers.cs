using System;
using System.Collections.Generic;
using System.Linq;
using NUnit.Framework;
using Should;
using SpecsFor.Core.ShouldExtensions;

namespace SmartMoving.IntegrationSpecs.Helpers
{
    public static class ShouldHelpers
    {
        public static void ShouldBeNear(this DateTimeOffset dateTimeOffset, DateTimeOffset expected, TimeSpan? tolerance = null)
        {
            if (tolerance is null)
            {
                tolerance = Some.DefaultDateTimeTolerance;
            }

            dateTimeOffset.ShouldBeInRange(expected.Subtract(tolerance.Value), expected.Add(tolerance.Value));
        }

        public static void ShouldBeNear(this DateTimeOffset? dateTimeOffset, DateTimeOffset expected, TimeSpan? tolerance = null)
        {
            if (!dateTimeOffset.HasValue)
            {
                Assert.Fail($"Actual value was null, instead of near {expected}");
            }

            dateTimeOffset.Value.ShouldBeNear(expected, tolerance);
        }

        public static void ShouldBeOrderedAlphabetically(this IEnumerable<string> values)
        {
            var valuesArray = values.ToArray();

            if (!valuesArray.Any())
            {
                return;
            }

            for (var i = 0; i < valuesArray.Length - 1; i++)
            {
                if (StringComparer.Ordinal.Compare(valuesArray[i], valuesArray[i + 1]) > 0)
                {
                    Assert.Fail($"Items are not in alphabetical order: \r\n[{i}] = {valuesArray[i]}\r\n[{i+1}] = {valuesArray[i+1]}");
                }
            }
        }
    }
}
