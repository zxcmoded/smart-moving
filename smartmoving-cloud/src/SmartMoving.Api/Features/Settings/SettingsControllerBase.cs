using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartMoving.Api.Features.Common;
using SmartMoving.Data;
using SmartMoving.Data.Contexts;

namespace SmartMoving.Api.Features.Settings
{
    public abstract class SettingsControllerBase<TViewModel, TDomainModel> : SmartMovingController 
        where TDomainModel : class, new()
        where TViewModel : new()
    {
        protected readonly AppDbContext Context;
        private readonly IMapper _mapper;

        protected SettingsControllerBase(AppDbContext context, IMapper mapper)
        {
            Context = context;
            _mapper = mapper;
        }

        protected virtual Task BeforeUpdate(TDomainModel domainModel, TViewModel viewModel)
        {
            return Task.CompletedTask;
        }

        protected virtual Task AfterUpdate(TDomainModel domainModel, TViewModel viewModel)
        {
            return Task.CompletedTask;
        }

        [HttpGet]
        public async Task<ActionResult<TViewModel>> Get()
        {
            var settings = await Context.Set<TDomainModel>().AsNoTracking()
                .ProjectTo<TViewModel>(_mapper.ConfigurationProvider)
                .SingleOrDefaultAsync();

            if (settings == null)
            {
                var model = new TDomainModel();
                settings = _mapper.Map<TViewModel>(model);
            }

            return Ok(settings);
        }

        [HttpPut]
        public async Task<ActionResult<TViewModel>> Update(TViewModel form)
        {
            var settings = await Context.Set<TDomainModel>()
                .SingleOrDefaultAsync();

            if (settings == null)
            {
                settings = new TDomainModel();
                Context.Set<TDomainModel>().Add(settings);
            }
            else
            {
                Context.Set<TDomainModel>().Update(settings);
            }

            await BeforeUpdate(settings, form);

            _mapper.Map(form, settings);

            await Context.SaveChangesAsync();

            var result = await Context.Set<TDomainModel>()
                .ProjectTo<TViewModel>(_mapper.ConfigurationProvider)
                .SingleOrDefaultAsync();

            await AfterUpdate(settings, form);

            return Ok(result);
        }
    }
}
