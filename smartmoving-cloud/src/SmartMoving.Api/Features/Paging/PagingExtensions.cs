using System;
using System.Data;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SmartMoving.Data;
using SmartMoving.Data.Contexts;

namespace SmartMoving.Api.Features.Paging
{
    public static class PagingExtensions
    {
        public static async Task<PageViewModel<T>> GetPageAsync<T>(this IQueryable<T> query, 
            PageRequestModel pageRequest,
            Func<IQueryable<T>, IQueryable<T>> defaultSort = null) where T : class
        {
            return await ExecuteGetPageAsyncInternal(query, pageRequest, null, defaultSort);
        }

        public static async Task<PageViewModel<T>> GetPageAsyncWithReadUncommitted<T>(this IQueryable<T> query, 
            PageRequestModel pageRequest,
            DbContext context,
            Func<IQueryable<T>, IQueryable<T>> defaultSort = null) where T : class
        {
            return await ExecuteGetPageAsyncInternal(query, pageRequest, context, defaultSort);
        }

        private static async Task<PageViewModel<T>> ExecuteGetPageAsyncInternal<T>(IQueryable<T> query, 
            PageRequestModel pageRequest,
            DbContext context, 
            Func<IQueryable<T>, IQueryable<T>> defaultSort) where T : class
        {
            var result = new PageViewModel<T>
            {
                TotalResults = await query.CountAsync()
            };

            if (result.TotalResults <= (pageRequest.Page - 1) * pageRequest.PageSize)
            {
                pageRequest.Page = 1;
            }

            if (!string.IsNullOrWhiteSpace(pageRequest.Sort) && pageRequest.Sort.Trim().Length > 1)
            {
                var parameter = pageRequest.Sort.Trim().Substring(1);

                var actualPropertyName = typeof(T).GetProperties().First(x => x.Name.ToLower() == parameter.ToLower()).Name;

                query = pageRequest.Sort[0] == '+'
                    ? query.OrderBy(actualPropertyName)
                    : query.OrderByDescending(actualPropertyName);
            }
            else if (defaultSort != null)
            {
                query = defaultSort(query);
            }

            query = query.Skip((pageRequest.Page - 1) * pageRequest.PageSize).Take(pageRequest.PageSize);

            result.PageResults = context != null
                ? await query.WithReadUncommitted(context).ToArrayAsync()
                : await query.ToArrayAsync();

            result.TotalThisPage = result.PageResults.Length;

            result.PageSize = pageRequest.PageSize;

            result.PageNumber = pageRequest.Page;

            return result;
        }

        public static IOrderedQueryable<TSource> OrderBy<TSource>(this IQueryable<TSource> query, string propertyName)
        {
            var entityType = typeof(TSource);

            //Create x => x.PropName
            var propertyInfo = entityType.GetProperty(propertyName);
            var arg = Expression.Parameter(entityType, "x");
            var property = Expression.Property(arg, propertyName);
            var selector = Expression.Lambda(property, arg);

            var enumerableType = typeof(Queryable);
            var method = enumerableType.GetMethods()
                .Where(m => m.Name == "OrderBy" && m.IsGenericMethodDefinition)
                .Where(m =>
                {
                    var parameters = m.GetParameters().ToList();
                    // Put more restriction here to ensure selecting the right overload                
                    return parameters.Count == 2;
                }).Single();

            //The linq's OrderBy<TSource, TKey> has two generic types, which provided here
            var genericMethod = method.MakeGenericMethod(entityType, propertyInfo.PropertyType);

            /*Call query.OrderBy(selector), with query and selector: x=> x.PropName
            Note that we pass the selector as Expression to the method and we don't compile it.
            By doing so EF can extract "order by" columns and generate SQL for it.*/
            var newQuery = (IOrderedQueryable<TSource>)genericMethod.Invoke(genericMethod, new object[] { query, selector });

            return newQuery;
        }

        public static IOrderedQueryable<TSource> OrderByDescending<TSource>(this IQueryable<TSource> query, string propertyName)
        {
            var entityType = typeof(TSource);

            //Create x => x.PropName
            var propertyInfo = entityType.GetProperty(propertyName);
            var arg = Expression.Parameter(entityType, "x");
            var property = Expression.Property(arg, propertyName);
            var selector = Expression.Lambda(property, arg);

            var enumerableType = typeof(Queryable);
            var method = enumerableType.GetMethods()
                .Where(m => m.Name == "OrderByDescending" && m.IsGenericMethodDefinition)
                .Where(m =>
                {
                    var parameters = m.GetParameters().ToList();
                    // Put more restriction here to ensure selecting the right overload                
                    return parameters.Count == 2;
                }).Single();

            //The linq's OrderBy<TSource, TKey> has two generic types, which provided here
            var genericMethod = method.MakeGenericMethod(entityType, propertyInfo.PropertyType);

            /*Call query.OrderBy(selector), with query and selector: x=> x.PropName
            Note that we pass the selector as Expression to the method and we don't compile it.
            By doing so EF can extract "order by" columns and generate SQL for it.*/
            var newQuery = (IOrderedQueryable<TSource>)genericMethod.Invoke(genericMethod, new object[] { query, selector });

            return newQuery;
        }
    
        public static async Task<PageViewModel<T>> GetPageAsyncReadUncommitted<T>(this IQueryable<T> query, 
            AppDbContext context,
            PageRequestModel pageRequest,
            Func<IQueryable<T>, IQueryable<T>> defaultSort = null) where T : class
        {
            return await TransactionHelper.ExecuteWithResultsAsync(context, IsolationLevel.ReadUncommitted, async () =>
            {
                var results = await query.GetPageAsync(pageRequest, defaultSort);

                return (false, results);
            });
        }
    }
}
