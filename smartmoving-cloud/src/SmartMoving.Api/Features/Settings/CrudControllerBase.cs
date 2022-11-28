using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartMoving.Api.Features.Common;
using SmartMoving.Core.Data;
using SmartMoving.Core.Data.Core;
using SmartMoving.Data;
using SmartMoving.Data.Contexts;
using StructureMap.TypeRules;

namespace SmartMoving.Api.Features.Settings
{
    public abstract class CrudControllerBase<TViewModel, TForm, TDomainModel> : SmartMovingController
        where TDomainModel : EntityBase
    {
        protected readonly AppDbContext _context;
        protected readonly IMapper _mapper;

        protected CrudControllerBase(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TViewModel>> GetOne(Guid id)
        {
            var result = await _context.Set<TDomainModel>()
                                       .AsNoTracking()
                                       .Where(x => x.Id == id)
                                       .ProjectTo<TViewModel>(_mapper.ConfigurationProvider)
                                       .SingleOrDefaultAsync();

            if (result == null)
            {
                return BadRequest($"Entity of type {typeof(TDomainModel).Name} with id {id} was not found.");
            }

            return Ok(result);
        }

        [HttpGet]
        public virtual async Task<ActionResult<TViewModel[]>> GetAll()
        {
            var query = _context.Set<TDomainModel>().AsQueryable();

            if (typeof(TDomainModel).CanBeCastTo<ISoftDeletableEntity>())
            {
                query = ApplySoftDeleteFilter((dynamic)query);
            }

            var result = await query.AsNoTracking()
                                    .ProjectTo<TViewModel>(_mapper.ConfigurationProvider)
                                    .ToArrayAsync();

            return Ok(result);
        }

        private IQueryable<T> ApplySoftDeleteFilter<T>(IQueryable<T> queryable) where T : ISoftDeletableEntity
        {
            return queryable.WhereNotDeleted();
        }

        [HttpPost]
        public async Task<ActionResult<TViewModel>> Create(TForm form)
        {
            var entity = _mapper.Map<TDomainModel>(form);

            await BeforeAdd(entity, form);

            _context.Set<TDomainModel>().Add(entity);
            await _context.SaveChangesAsync();

            var result = await _context.Set<TDomainModel>()
                                       .AsNoTracking()
                                       .Where(x => x.Id == entity.Id)
                                       .ProjectTo<TViewModel>(_mapper.ConfigurationProvider)
                                       .SingleAsync();

            await AfterAdd(entity, form);

            return Ok(result);
        }

        protected virtual Task BeforeAdd(TDomainModel entity, TForm form)
        {
            return Task.CompletedTask;
        }

        protected virtual Task AfterAdd(TDomainModel entity, TForm form)
        {
            return Task.CompletedTask;
        }

        /// <summary>
        /// Used when getting the entity in edit scenarios. Override if you need to include relationships.
        /// </summary>
        /// <returns></returns>
        protected virtual IQueryable<TDomainModel> GetDbSet()
        {
            return _context.Set<TDomainModel>();
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<TViewModel>> Edit(Guid id, TForm form)
        {
            var entity = await GetDbSet()
                .SingleOrDefaultAsync(x => x.Id == id);

            if (entity == null)
            {
                return BadRequest($"Entity of type {typeof(TDomainModel).Name} with id {id} was not found.");
            }

            if (form is IFormWithId withId)
            {
                withId.Id = entity.Id;
            }

            await BeforeUpdate(entity, form);

            _mapper.Map(form, entity);

            //Some properties with value converters aren't tracked correctly by EF.  This should resolve that.
            _context.Set<TDomainModel>().Update(entity);

            await _context.SaveChangesAsync();

            var result = await _context.Set<TDomainModel>()
                                       .Where(x => x.Id == entity.Id)
                                       .ProjectTo<TViewModel>(_mapper.ConfigurationProvider)
                                       .SingleAsync();

            return Ok(result);
        }

        protected virtual Task BeforeUpdate(TDomainModel entity, TForm form)
        {
            return Task.CompletedTask;
        }

        [HttpDelete("{id}")]
        public virtual async Task<ActionResult> Delete(Guid id)
        {
            var result = await _context.Set<TDomainModel>()
                                       .SingleOrDefaultAsync(x => x.Id == id);

            if (result == null)
            {
                return BadRequest($"Entity of type {typeof(TDomainModel).Name} with id {id} was not found.");
            }

            await BeforeDelete(result);

            _context.Set<TDomainModel>().Remove(result);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex) when (ex.ToString().Contains("The DELETE statement conflicted with the REFERENCE constraint"))
            {
                // We only really get this with branches, but figure it's a good mix of "accurate" and "generic" to be fine for now.
                return BadRequest("This is associated to one or more jobs, and cannot be deleted.", logInfo: true);
            }

            return Ok();
        }

        protected virtual Task BeforeDelete(TDomainModel result)
        {
            return Task.CompletedTask;
        }
    }
}