using Microsoft.EntityFrameworkCore;
using SmartMoving.Core.Data.Core;
using SmartMoving.Core.Data.Security;

namespace SmartMoving.Data.Contexts
{
    public abstract partial class BaseDbContext<TContext>
    {
        public new FilteredUserSet Users => new FilteredUserSet(Set<AppUser>(), _currentUser);

        public DbSet<Customer> Customers { get; set; }

        public DbSet<Branch> Branches { get; set; }

        public DbSet<Company> Companies { get; set; }
    }
}