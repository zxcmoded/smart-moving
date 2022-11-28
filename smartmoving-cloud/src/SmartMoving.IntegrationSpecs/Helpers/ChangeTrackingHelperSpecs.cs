using NUnit.Framework;
using Should;
using SmartMoving.Core.Helpers;

namespace SmartMoving.IntegrationSpecs.Helpers
{
    public class ChangeTrackingHelperSpecs
    {
        [TestCase(0, 0)]
        [TestCase(1.1, 1.1)]
        [TestCase(true, true)]
        [TestCase("", null)]
        [TestCase(null, "")]
        [TestCase("same", "same")]
        public void CheckIfChanged_False(object initialVal, object newVal)
        {
            var hasChanged = false;
            object result = null;
            ChangeTrackingHelper.CheckIfChanged(initialVal, newVal, ref hasChanged, () => { return result = newVal; });

            hasChanged.ShouldBeFalse();
            result.ShouldBeNull();
        }

        [TestCase(0, 1)]
        [TestCase(1.1, 1.2)]
        [TestCase(true, false)]
        [TestCase("initial", "new")]
        [TestCase("initial", null)]
        [TestCase(null, "new")]
        public void CheckIfChanged_True(object initialVal, object newVal)
        {
            var hasChanged = false;
            object result = null;
            ChangeTrackingHelper.CheckIfChanged(initialVal, newVal, ref hasChanged, () => { return result = newVal; });

            hasChanged.ShouldBeTrue();
            result.ShouldEqual(newVal);
        }
    }
}