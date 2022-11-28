using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Identity;
using SmartMoving.Core.Data.Core;
using SmartMoving.Core.Extensions;

namespace SmartMoving.Core.Data.Security
{
    public class AppRole : IdentityRole<Guid>, IBelongToCompany
    {
        public AppRole() : base()
        {}

        public AppRole(string name) : base(name)
        {
            NormalizedName = NormalizeName(name);
        }

        public AppRole(string name, IEnumerable<Permission> permissions) : this(name)
        {
            _permissions = permissions.ToArray();
        }

        public Guid CompanyId { get; set; }

        public string Permissions
        {
            get
            {
                return PermissionsToString(_permissions);
            }
            set
            {
                _permissions = PermissionsToList(value);
            }
        }

        private IList<Permission> _permissions { get; set; } = new List<Permission>();

        public static string NormalizeName(string name)
        {
            return name.ToUpper().Replace(" ", string.Empty);
        }

        public void AddPermission(Permission permission)
        {
            if (HasPermission(permission))
            {
                return;
            }

            _permissions.Add(permission);
        }

        public void RemovePermission(Permission permission)
        {
            _permissions.Remove(permission);
        }

        public bool HasPermission(Permission permission)
        {
            return _permissions.Contains(permission);
        }

        public void SetPermissions(IEnumerable<Permission> permissions)
        {
            _permissions = permissions.ToList();
        }

        public static IList<Permission> PermissionsToList(string permissionString)
        {
            if (string.IsNullOrWhiteSpace(permissionString))
            {
                return new List<Permission>();
            }
            
            return permissionString.Split('|')
                                .Where(x => !string.IsNullOrWhiteSpace(x))
                                .Select(x => EnumHelper.Parse<Permission>(x))
                                .ToList();
        }

        public static string PermissionsToString(IEnumerable<Permission> permissions)
        {
            // Why wrap it in "|"?  So you can do an exact-match search with a Contains/Like query. 
            return $"|{string.Join('|', permissions.Select(x => (int)x).OrderBy(x => x))}|";
        }

        public static bool HasPermission(string permissionString, Permission permission)
        {
            return PermissionsToList(permissionString).Contains(permission);
        }
    }
}
