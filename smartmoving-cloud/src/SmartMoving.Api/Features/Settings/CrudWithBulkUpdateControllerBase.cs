using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartMoving.Core.Data;
using SmartMoving.Data;
using SmartMoving.Data.Contexts;

namespace SmartMoving.Api.Features.Settings
{
    public abstract class CrudWithBulkUpdateControllerBase<TViewModel, TForm, TDomainModel> : CrudControllerBase<TViewModel, TForm, TDomainModel> 
        where TDomainModel : EntityBase
        where TForm : IFormWithId
    {
        protected CrudWithBulkUpdateControllerBase(AppDbContext context, IMapper mapper) : base(context, mapper)
        {
        }

        [HttpPut]
        public async Task<ActionResult<TViewModel[]>> BulkUpdate([FromBody]TForm[] forms)
        {
            var entities = await _context.Set<TDomainModel>()
                .ToDictionaryAsync(x => x.Id);

            foreach (var form in forms)
            {
                if (!form.Id.HasValue)
                {
                    return BadRequest("All inputs must have an ID set in order to use the bulk update endpoint.");
                }

                if (!entities.ContainsKey(form.Id.Value))
                {
                    return BadRequest($"Target entity with ID {form.Id} was not found.");
                }

                var target = entities[form.Id.Value];

                _mapper.Map(form, target);

                //Some properties with value converters aren't tracked correctly by EF.  This should resolve that.
                _context.Set<TDomainModel>().Update(target);
            }

            await _context.SaveChangesAsync();

            return await GetAll();
        }

    }
}
