using System;
using System.Data;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SmartMoving.Data.Contexts;

namespace SmartMoving.Data
{
    public static class TransactionHelper
    {
        public static async Task<T> ExecuteWithResultsAsync<T>(DbContext context, IsolationLevel isolationLevel, Func<Task<(bool commit, T results)>> operation)
        {
            var strategy = context.Database.CreateExecutionStrategy();

            return await strategy.ExecuteAsync(async () =>
            {
                if (context.Database.CurrentTransaction != null && ((context as AppDbContext)?.IsRunningIntegrationSpecs ?? false))
                {
                    var (_, results) = await operation();
                    return results;
                }

                using var tx = await context.Database.BeginTransactionAsync(isolationLevel);
                {
                    var (commit, results) = await operation();

                    if (commit)
                    {
                        tx.Commit();
                    }

                    return results;
                }
            });
        }

        /// <summary>
        /// Don't use this. It's for a startup task only.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="isolationLevel"></param>
        /// <param name="operation"></param>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public static T ExecuteWithResultsSync<T>(DbContext context, IsolationLevel isolationLevel, Func<(bool commit, T results)> operation)
        {
            var strategy = context.Database.CreateExecutionStrategy();

            return strategy.Execute(() =>
            {
                if (context.Database.CurrentTransaction != null && ((context as AppDbContext)?.IsRunningIntegrationSpecs ?? false))
                {
                    var (_, results) = operation();
                    return results;
                }

                using var tx = context.Database.BeginTransaction(isolationLevel);
                {
                    var (commit, results) = operation();

                    if (commit)
                    {
                        tx.Commit();
                    }

                    return results;
                }
            });
        }
    }
}