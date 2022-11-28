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
using SmartMoving.Api.Features.Paging;
using SmartMoving.Api.Infrastructure;
using SmartMoving.Data;
using SmartMoving.Data.Contexts;

namespace SmartMoving.Api.Features.Customers.GetCustomers
{
    [StandardRoute("customers"),
     Authorize,
     ApiController]
    public class GetCustomersController : SmartMovingController
    {
        private readonly AppDbContext _context;
        private readonly CustomerSearchBuilder _customerSearchBuilder;
        private readonly IMapper _mapper;

        public GetCustomersController(AppDbContext context, CustomerSearchBuilder customerSearchBuilder, IMapper mapper)
        {
            _context = context;
            _customerSearchBuilder = customerSearchBuilder;
            _mapper = mapper;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CustomerDetailsViewModel>> GetCustomerDetails(Guid id)
        {
            var customer = await _context.Customers
                                         .Where(x => x.Id == id)
                                         .ProjectTo<CustomerDetailsViewModel>(_mapper.ConfigurationProvider)
                                         .WithReadUncommitted(_context)
                                         .SingleOrDefaultAsync();

            if (customer == null)
            {
                return NotFoundBadRequest("customer");
            }

            return Ok(customer);
        }

        [HttpGet("search-list")]
        public async Task<ActionResult<PageViewModel<CustomerSummaryViewModel>>> SearchAll([FromQuery] CustomerSearchCriteriaForm[] criteria,
            [FromQuery] PageRequestModel page)
        {
            var query = _context.Customers.AsQueryable();

            try
            {
                foreach (var c in criteria)
                {
                    query = _customerSearchBuilder.Process(c, query);
                }
            }
            catch (NotImplementedException)
            {
                return BadRequest("The query criteria used an unsupported combination of parameters.");
            }

            var summaries = await TransactionHelper.ExecuteWithResultsAsync(_context, System.Data.IsolationLevel.ReadUncommitted, async () =>
            {
                var results = await query
                                    .ProjectTo<CustomerSummaryViewModel>(_mapper.ConfigurationProvider)
                                    .GetPageAsync(page, q => q.OrderByDescending(x => x.CreatedAtUtc));

                return (false, results);
            });

            return Ok(summaries);
        }
    }
}