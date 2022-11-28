using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartMoving.Api.Features.Common;
using SmartMoving.Api.Features.Customers.Common;
using SmartMoving.Api.Features.Customers.GetCustomers;
using SmartMoving.Api.Infrastructure;
using SmartMoving.Core.Data.Core;
using SmartMoving.Core.Extensions;
using SmartMoving.Data;
using SmartMoving.Data.Contexts;

namespace SmartMoving.Api.Features.Customers.UpdateCustomer
{
    [StandardRoute("customers/{id}"),
     Authorize,
     ApiController]
    public class UpdateCustomerController : SmartMovingController
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public UpdateCustomerController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpPut]
        public async Task<ActionResult<CustomerDetailsViewModel>> UpdateCustomer(Guid id, EditCustomerForm form)
        {
            var target = await _context.Customers.SingleOrDefaultAsync(x => x.Id == id);

            if (target == null)
            {
                return BadRequest("The target customer was not found.");
            }

            _mapper.Map(form, target);
            target.EmailAddress = target.EmailAddress.TrimSafe();
            target.NormalizePhoneNumbers();

            //Necessary because EF doesn't recognize changes to fields that have a 
            //conversion function specified, like SecondaryPhoneNumbers. 
            _context.Entry(target).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            var result = await _context.Customers
                                       .Where(x => x.Id == id)
                                       .ProjectTo<CustomerDetailsViewModel>(_mapper.ConfigurationProvider)
                                       .SingleAsync();

            return Ok(result);
        }

        internal Task<ActionResult<CustomerDetailsViewModel>> UpdateCustomer(Guid id, Customer customer)
        {
            throw new NotImplementedException();
        }
    }
}