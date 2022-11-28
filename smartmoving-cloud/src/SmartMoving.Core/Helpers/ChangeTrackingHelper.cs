using System;

namespace SmartMoving.Core.Helpers
{
    public static class ChangeTrackingHelper
    {
        public static void CheckIfChanged<T>(object initialValue, object newValue, ref bool hasChanged, Func<T> callback)
        {
            if (Equals(initialValue, newValue))
            {
                return;
            }

            // for strings, the initial sometimes can be null and the new can be string.empty
            if ((initialValue is string initialString && string.IsNullOrWhiteSpace(initialString) || initialValue is null) && 
                (newValue is string newString && string.IsNullOrWhiteSpace(newString) || newValue is null))
            {
                return;
            }

            hasChanged = true;
            callback();
        }
    }
}
