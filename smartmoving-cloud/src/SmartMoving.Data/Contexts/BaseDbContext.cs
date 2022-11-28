using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using SmartMoving.Core;
using SmartMoving.Core.Data.Core;
using SmartMoving.Core.Data.Security;
using SmartMoving.Core.Extensions;
using Z.EntityFramework.Plus;

namespace SmartMoving.Data.Contexts
{
    public abstract partial class BaseDbContext<TContext> : IdentityDbContext<AppUser, AppRole, Guid> where TContext : DbContext
    {
        private ICurrentUser _currentUser;

#if DEBUG
        // ReSharper disable once InconsistentNaming
        // ReSharper disable once IdentifierTypo
        public Guid AAAAId = Guid.NewGuid();
#endif

        public ICurrentUser CurrentUser => _currentUser;

        /// <summary>
        /// This is mainly a hack. This lets us work around some transaction related issues (because we run code in a transaction to easily roll it back during specs).
        /// With this, we can make sure if we're executing our "hack" code that it's only for specs, so a production issue doesn't creep in.
        /// </summary>
        public bool IsRunningIntegrationSpecs = false;

        protected BaseDbContext(DbContextOptions<TContext> options, ICurrentUser currentUser) : base(options)
        {
            _currentUser = currentUser;

            ConfigureCompanyFilters();

            ToggleCompanyFilters();
        }

        public override Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess, CancellationToken cancellationToken = new CancellationToken())
        {
            ApplyCurrentCompanyToNewEntities();

            return base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
        }

        public override int SaveChanges(bool acceptAllChangesOnSuccess)
        {
            ApplyCurrentCompanyToNewEntities();

            return base.SaveChanges(acceptAllChangesOnSuccess);
        }

        private void ApplyCurrentCompanyToNewEntities()
        {
            if (_currentUser.CompanyId == Guid.Empty)
            {
                return;
            }

            var entitiesToAssociate = ChangeTracker.Entries()
                                                   .Where(x => x.State == EntityState.Added)
                                                   .Select(x => x.Entity)
                                                   .OfType<IBelongToCompany>()
                                                   .Where(x => x.CompanyId == Guid.Empty)
                                                   .ToArray();

            foreach (var entity in entitiesToAssociate)
            {
                entity.CompanyId = _currentUser.CompanyId;
            }

            var usersToAssociate = ChangeTracker.Entries()
                                                .Where(x => x.State == EntityState.Added)
                                                .Select(x => x.Entity)
                                                .OfType<AppUser>()
                                                .Where(x => x.CompanyId == Guid.Empty)
                                                .ToArray();

            foreach (var entity in usersToAssociate)
            {
                entity.CompanyId = _currentUser.CompanyId;
            }
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            ConfigureIdentityEntities(builder);

            builder.ApplyAllConfigurationsFromAssemblyContainingType<Company>();
        }

        private void ConfigureCompanyFilters()
        {
            this.Filter<Company>(QueryFilters.Company, q => q.Where(x => x.Id == _currentUser.CompanyId));
            this.Filter<IBelongToCompany>(QueryFilters.IBelongToCompany, q => q.Where(x => x.CompanyId == _currentUser.CompanyId));
        }

        private void ToggleCompanyFilters()
        {
            var enable = _currentUser.CompanyId != Guid.Empty;

            if (enable)
            {
                this.Filter(QueryFilters.Company).Enable();
                this.Filter(QueryFilters.IBelongToCompany).Enable();
            }
            else
            {
                this.Filter(QueryFilters.Company).Disable();
                this.Filter(QueryFilters.IBelongToCompany).Disable();
            }

            Users.SetCurrentUser(_currentUser);
        }

        private static void ConfigureIdentityEntities(ModelBuilder builder)
        {
            builder.Entity<AppRole>(entity =>
            {
                entity.ToTable("Roles", "Security");
                entity.HasIndex(x => new { x.Name }).IsUnique(false);
                entity.HasIndex(x => new { x.NormalizedName }).IsUnique(false);
            });

            builder.Entity<IdentityUserClaim<Guid>>(entity => { entity.ToTable("UserClaims", "Security"); });

            builder.Entity<IdentityUserLogin<Guid>>(entity => { entity.ToTable("UserLogins", "Security"); });

            builder.Entity<IdentityRoleClaim<Guid>>(entity => { entity.ToTable("RoleClaims", "Security"); });

            builder.Entity<IdentityUserRole<Guid>>(entity => { entity.ToTable("UserRoles", "Security"); });

            builder.Entity<IdentityUserToken<Guid>>(entity => { entity.ToTable("UserTokens", "Security"); });
        }

        public void RemoveCompanyFilter()
        {
            _currentUser = new AnonymousUser();
            ToggleCompanyFilters();
        }

        public void SetCurrentUser(ICurrentUser user)
        {
            _currentUser = user;
            ToggleCompanyFilters();
        }

        private static object GetFilterKeyFor<T>()
        {
            return GetFilterKeyFor(typeof(T));
        }

        private static object GetFilterKeyFor(Type type)
        {
            return $"CompanyFilter{type}";
        }
    }
}