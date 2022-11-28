using System;
using System.Threading.Tasks;
using SmartMoving.Data.Contexts;

namespace SmartMoving.IntegrationSpecs.Builders
{
    public abstract class BaseBuilder<TEntity>
        where TEntity : class
    {
        protected static Random Rand = new Random(1);

        protected AppDbContext Context { get; set; }

        public TEntity Entity { get; set; }

        /// <summary>
        /// Constructor that also builds the entity and runs the overrides.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="overrides"></param>
        protected BaseBuilder(AppDbContext context, Action<TEntity> overrides)
        {
            Context = context;
            Entity = BuildEntity();

            if (Entity is null)
            {
                // In rare cases, we need to control the constructor more.
                return;
            }

            overrides?.Invoke(Entity);
        }

        /// <summary>
        /// Constructor that just sets the context. If you use this constructor you also need to set the <see cref="Entity"/> before calling <see cref="FinishAsync"/>
        /// </summary>
        /// <param name="context"></param>
        protected BaseBuilder(AppDbContext context) => Context = context;

        protected virtual async Task AddEntityToContext() => await Context.Set<TEntity>().AddAsync(Entity);

        /// <summary>
        /// Can be used by derived builders to do last-minute initialization of
        /// required properties and relationships.
        /// </summary>
        protected virtual Task InitializeMissingMembers()
        {
            return Task.CompletedTask;
        }

        public BaseBuilder<TEntity> Override(Action<TEntity> overrides)
        {
            overrides?.Invoke(Entity);

            return this;
        }

        public virtual async Task<TEntity> FinishAsync(Action<TEntity> overrides = null)
        {
            await InitializeMissingMembers();
            await AddEntityToContext();
            overrides?.Invoke(Entity);
            return Entity;
        }

        public virtual TEntity FinishSync(Action<TEntity> overrides = null)
        {
            return FinishAsync(overrides).GetAwaiter().GetResult();
        }

        protected abstract TEntity BuildEntity();

        protected void SetIfUnset(string valueToTest, Action<TEntity> update)
        {
            if (string.IsNullOrWhiteSpace(valueToTest))
            {
                update(Entity);
            }
        }

        protected void SetIfUnset(DateTimeOffset valueToTest, Action<TEntity> update)
        {
            if (valueToTest == default)
            {
                update(Entity);
            }
        }
    }
}