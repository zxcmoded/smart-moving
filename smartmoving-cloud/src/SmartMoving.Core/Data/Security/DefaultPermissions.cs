using System.Collections.Generic;
using System.Linq;
using SmartMoving.Core.Extensions;

namespace SmartMoving.Core.Data.Security
{
    /// <summary>
    /// Used when setting up a new company only.
    /// </summary>
    public static class DefaultPermissions
    {
        public static IEnumerable<Permission> For(DefaultRole role)
        {
            return EnumHelper.GetAll<Permission>();
        }
    }

    public enum DefaultRole
    {
        Admin
    }
}