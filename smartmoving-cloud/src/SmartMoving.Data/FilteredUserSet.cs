using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using SmartMoving.Core;
using SmartMoving.Core.Data.Security;

namespace SmartMoving.Data
{
    public class FilteredUserSet : IQueryable<AppUser>
    {
        private readonly DbSet<AppUser> _set;
        private ICurrentUser _currentUser;
        private IQueryable<AppUser> _queryableImplementation;

        public FilteredUserSet(DbSet<AppUser> set, ICurrentUser currentUser)
        {
            _set = set;

            SetCurrentUser(currentUser);
        }

        public IEnumerator<AppUser> GetEnumerator()
        {
            return _queryableImplementation.GetEnumerator();
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return ((IEnumerable) _queryableImplementation).GetEnumerator();
        }

        public void SetCurrentUser(ICurrentUser currentUser)
        {
            _currentUser = currentUser;
            _queryableImplementation = (currentUser is AnonymousUser || currentUser.CompanyId == default) ? _set : _set.Where(x => x.CompanyId == currentUser.CompanyId);
        }

        public Type ElementType => _queryableImplementation.ElementType;

        public Expression Expression => _queryableImplementation.Expression;

        public IQueryProvider Provider => _queryableImplementation.Provider;

        public DbSet<AppUser> GetSet()
        {
            return _set;
        }

        public EntityEntry<AppUser> Update(AppUser entity)
        {
            return _set.Update(entity);
        }

        public EntityEntry<AppUser> Add(AppUser entity)
        {
            if (entity.CompanyId == Guid.Empty)
            {
                entity.CompanyId = _currentUser.CompanyId;
            }
            
            return _set.Add(entity);
        }

        public EntityEntry<AppUser> Remove(AppUser entity)
        {
            return _set.Remove(entity);
        }

        /// <summary>
        /// Returns a new set without any filtering in place. 
        /// </summary>
        /// <returns></returns>
        public FilteredUserSet WithoutFiltering()
        {
            return new FilteredUserSet(_set, new AnonymousUser());
        }
    }
}
