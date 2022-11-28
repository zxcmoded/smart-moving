using System;

namespace SmartMoving.Core.Data.Security
{
    [ExportEnumAsInteger]
    public enum Permission
    {
        [PermissionInfo(PermissionCategory.Modules)]
        CompanyDashboard = 5,

        [PermissionInfo(PermissionCategory.Modules)]
        Customers = 25,

        [PermissionInfo(PermissionCategory.Modules)]
        Settings = 150,
    }

    public class PermissionInfoAttribute : Attribute
    {
        public readonly PermissionCategory Category;

        public PermissionInfoAttribute(PermissionCategory category)
        {
            Category = category;
        }
    }

    public enum PermissionCategory
    {
        Modules = 0
    }
}