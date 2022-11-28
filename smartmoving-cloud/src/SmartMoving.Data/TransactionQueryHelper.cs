using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace SmartMoving.Data
{
    public static class TransactionQueryHelperExtensions
    {
        public static TransactionQueryHelper<T> WithReadUncommitted<T>(this IQueryable<T> query, DbContext context)
        {
            return new TransactionQueryHelper<T>(IsolationLevel.ReadUncommitted, query, context);
        }

        public static async Task LoadAsyncWithReadUncommitted<TEntity, TProperty>(this CollectionEntry<TEntity, TProperty> collection, DbContext context)
            where TProperty : class where TEntity : class
        {
            await TransactionHelper.ExecuteWithResultsAsync(context, IsolationLevel.ReadUncommitted, async () =>
            {
                await collection.LoadAsync();
                return (true, false);
            });
        }

        public static async Task EnsureLoadedAsyncWithReadUncommitted<TEntity, TProperty>(this CollectionEntry<TEntity, TProperty> collection, DbContext context)
            where TProperty : class where TEntity : class
        {
            if (!collection.IsLoaded)
            {
                await collection.LoadAsyncWithReadUncommitted(context);
            }
        }
    }

    public class TransactionQueryHelper<T>
    {
        private readonly IsolationLevel _isolationLevel;
        private readonly IQueryable<T> _query;
        private readonly DbContext _context;

        public TransactionQueryHelper(IsolationLevel isolationLevel, IQueryable<T> query, DbContext context)
        {
            _isolationLevel = isolationLevel;
            _query = query;
            _context = context;
        }

        public async Task<T> SingleOrDefaultAsync(CancellationToken cancellationToken = default)
        {
            return await TransactionHelper.ExecuteWithResultsAsync(_context, _isolationLevel, async () =>
            {
                var results = await _query.SingleOrDefaultAsync(cancellationToken);

                return (false, results);
            });
        }

        public async Task<T> SingleAsync(CancellationToken cancellationToken = default)
        {
            return await TransactionHelper.ExecuteWithResultsAsync(_context, _isolationLevel, async () =>
            {
                var results = await _query.SingleAsync(cancellationToken);

                return (false, results);
            });
        }

        public async Task<T> SingleAsync(Expression<Func<T, bool>> expression)
        {
            return await TransactionHelper.ExecuteWithResultsAsync(_context, _isolationLevel, async () =>
            {
                var results = await _query.SingleAsync(expression);

                return (false, results);
            });
        }

        public async Task<T> SingleOrDefaultAsync(Expression<Func<T, bool>> expression, CancellationToken cancellationToken = default)
        {
            return await TransactionHelper.ExecuteWithResultsAsync(_context, _isolationLevel, async () =>
            {
                var results = await _query.SingleOrDefaultAsync(expression, cancellationToken);

                return (false, results);
            });
        }

        public T Single(Expression<Func<T, bool>> expression)
        {
            return TransactionHelper.ExecuteWithResultsSync(_context, _isolationLevel, () =>
            {
                var results = _query.Single(expression);

                return (false, results);
            });
        }

        public T SingleOrDefault()
        {
            return TransactionHelper.ExecuteWithResultsSync(_context, _isolationLevel, () =>
            {
                var results = _query.Single();

                return (false, results);
            });
        }

        public async Task<T[]> ToArrayAsync(CancellationToken cancellationToken = default)
        {
            return await TransactionHelper.ExecuteWithResultsAsync(_context, _isolationLevel, async () =>
            {
                var results = await _query.ToArrayAsync(cancellationToken);

                return (false, results);
            });
        }

        public async Task<List<T>> ToListAsync(CancellationToken cancellationToken = default)
        {
            return await TransactionHelper.ExecuteWithResultsAsync(_context, _isolationLevel, async () =>
            {
                var results = await _query.ToListAsync(cancellationToken);

                return (false, results);
            });
        }

        /// <summary>
        /// Don't use this. It's for a startup task only.
        /// </summary>
        /// <returns></returns>
        public bool AnySync(Expression<Func<T, bool>> expression)
        {
            return TransactionHelper.ExecuteWithResultsSync(_context, _isolationLevel, () => (false, _query.Any(expression)));
        }

        public async Task<bool> AnyAsync()
        {
            return await TransactionHelper.ExecuteWithResultsAsync(_context, _isolationLevel, async () => (false, await _query.AnyAsync()));
        }

        public async Task<bool> AnyAsync(Expression<Func<T, bool>> expression)
        {
            return await TransactionHelper.ExecuteWithResultsAsync(_context, _isolationLevel, async () => (false, await _query.AnyAsync(expression)));
        }

        public async Task<T> FirstAsync()
        {
            return await TransactionHelper.ExecuteWithResultsAsync(_context, _isolationLevel, async () => (false, await _query.FirstAsync()));
        }

        public async Task<T> FirstOrDefaultAsync()
        {
            return await TransactionHelper.ExecuteWithResultsAsync(_context, _isolationLevel, async () => (false, await _query.FirstOrDefaultAsync()));
        }

        public async Task<Dictionary<TKey, T>> ToDictionaryAsync<TKey>(Func<T, TKey> keySelector)
        {
            return await TransactionHelper.ExecuteWithResultsAsync(_context, _isolationLevel, async () => (false, await _query.ToDictionaryAsync(keySelector)));
        }

        public async Task<Dictionary<TKey, TElement>> ToDictionaryAsync<TKey, TElement>(Func<T, TKey> keySelector, Func<T, TElement> elementSelector)
        {
            return await TransactionHelper.ExecuteWithResultsAsync(_context, _isolationLevel,
                async () => (false, await _query.ToDictionaryAsync(keySelector, elementSelector)));
        }

        public async Task<int> CountAsync()
        {
            return await TransactionHelper.ExecuteWithResultsAsync(_context, _isolationLevel, async () => (false, await _query.CountAsync()));
        }

        public async Task<int> CountAsync(Expression<Func<T, bool>> predicate)
        {
            return await TransactionHelper.ExecuteWithResultsAsync(_context, _isolationLevel, async () => (false, await _query.CountAsync(predicate)));
        }

        public async Task<decimal> SumAsync(Expression<Func<T, decimal>> selector)
        {
            return await TransactionHelper.ExecuteWithResultsAsync(_context, _isolationLevel, async () => (false, await _query.SumAsync(selector)));
        }

        public async Task<TResult> MaxAsync<TResult>(Expression<Func<T, TResult>> selector)
        {
            return await TransactionHelper.ExecuteWithResultsAsync(_context, _isolationLevel, async () => (false, await _query.MaxAsync(selector)));
        }
    }
}