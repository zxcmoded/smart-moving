using System;
using System.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using SmartMoving.Data;
using SmartMoving.Data.Contexts;
using SmartMoving.IntegrationSpecs.Helpers;
using SpecsFor.Core.Configuration;

namespace SmartMoving.IntegrationSpecs.Infrastructure
{
    public class TransactionScopeWrapper : Behavior<INeedDatabase>
    {
        private IDbContextTransaction _transaction;

        public override void SpecInit(INeedDatabase instance)
        {
            _transaction = instance.Context.Database.BeginTransaction();
        }

        public override void AfterSpec(INeedDatabase instance)
        {
            try
            {
                 _transaction.Rollback();
            }
            catch (TimeoutException)
            {
                // Happens sometimes on the build server, but it should be fine. 
            }
        }
    }
}
