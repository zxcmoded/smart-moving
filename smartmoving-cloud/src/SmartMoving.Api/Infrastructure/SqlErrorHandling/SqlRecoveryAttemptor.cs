using System;
using System.Data.Common;
using System.Data.SqlClient;
using NLog;

namespace SmartMoving.Api.Infrastructure.SqlErrorHandling
{
    public class SqlRecoveryAttemptor
    {
        private static readonly Logger Logger = LogManager.GetCurrentClassLogger();

        public const int RetryCount = 4;

        public static bool ShouldTryRecover(Exception ex, int retryAttemptsCount)
        {
            return retryAttemptsCount <= RetryCount && IsMARSError(ex);
        }

        public static bool IsMARSError(Exception ex)
        {
            return ex.Message.Contains("MARS TDS header");
        }

        public static void TryRecover(SqlConnection sqlConn, int retryAttemptsCount)
        {
            Logger.Warn("Attempting recovery of connection due to MARS error.");
            if (retryAttemptsCount > 2)
            {
                System.Threading.Thread.Sleep(1500);
            }

            if (sqlConn.State != System.Data.ConnectionState.Closed)
            {
                TryClose(sqlConn);
                TryClearPool(sqlConn);
                TryOpen(sqlConn);
            }
            else
            {
                TryOpen(sqlConn);
                TryClose(sqlConn);
                TryClearPool(sqlConn);
                TryOpen(sqlConn);
                TryClose(sqlConn);
            }
        }

        private static void TryClearPool(SqlConnection conn)
        {
            try
            {
                SqlConnection.ClearPool(conn);
            }
            catch (Exception ex)
            {
                Logger.Error(ex, $"Error on {nameof(SqlRecoveryAttemptor)}.{nameof(TryClearPool)}.");
            }
        }

        private static void TryClose(DbConnection conn)
        {
            try
            {
                conn.Close();
            }
            catch (Exception ex)
            {
                Logger.Error(ex, $"Error on {nameof(SqlRecoveryAttemptor)}.{nameof(TryClose)}.");
            }
        }

        private static void TryOpen(DbConnection conn)
        {
            try
            {
                conn.Open();
            }
            catch (Exception ex)
            {
                Logger.Error(ex, $"Error on {nameof(SqlRecoveryAttemptor)}.{nameof(TryOpen)}.");
            }
        }
    }
}