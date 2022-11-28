using System;
using SystemSql = System.Data.SqlClient;
using MicrosoftSql = Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace SmartMoving.Api.Infrastructure.SqlErrorHandling
{
    public class CustomSqlServerRetryingExecutionStrategy : SqlServerRetryingExecutionStrategy
    {
        public CustomSqlServerRetryingExecutionStrategy(ExecutionStrategyDependencies dependencies) : base(dependencies)
        {
        }

        protected override bool ShouldRetryOn(Exception exception)
        {
            if (base.ShouldRetryOn(exception))
            {
                return true;
            }

            if (exception is not SystemSql.SqlException or MicrosoftSql.SqlException)
            {
                return false;
            }

            if (!SqlRecoveryAttemptor.ShouldTryRecover(exception, ExceptionsEncountered.Count))
            {
                return false;
            }

            if (Dependencies.CurrentContext.Context.Database.GetDbConnection() is not SystemSql.SqlConnection sqlConn)
            {
                return false;
            }

            SqlRecoveryAttemptor.TryRecover(sqlConn, ExceptionsEncountered.Count);

            return true;
        }
    }
}