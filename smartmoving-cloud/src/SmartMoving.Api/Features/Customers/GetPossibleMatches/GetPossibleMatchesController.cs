using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartMoving.Api.Features.Common;
using SmartMoving.Api.Infrastructure;
using SmartMoving.Core.Extensions;
using SmartMoving.Data;
using SmartMoving.Data.Contexts;

namespace SmartMoving.Api.Features.Customers.GetPossibleMatches
{
    [ApiController,
     Authorize,
     StandardRoute("customers/search")]
    public class GetPossibleMatchesController : SmartMovingController
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public GetPossibleMatchesController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<PossibleCustomerViewModel[]>> Get(string name, string phoneNumber, string emailAddress)
        {
            var matchesByName = !string.IsNullOrWhiteSpace(name) && name.Length > 2;

            var trimmedPhoneNumber = phoneNumber?.TrimNonDigits();

            var matchesByPhoneNumber = !string.IsNullOrWhiteSpace(trimmedPhoneNumber);

            var matchesByEmailAddress = !string.IsNullOrWhiteSpace(emailAddress);

            if (!matchesByEmailAddress && !matchesByPhoneNumber && !matchesByName)
            {
                return Ok(new PossibleCustomerViewModel[0]);
            }

            var results = await _context.Customers
                        .Where(x => (matchesByName && x.Name.Contains(name)) ||
                                    (matchesByPhoneNumber && x.PhoneNumber == trimmedPhoneNumber) ||
                                    (matchesByEmailAddress && x.EmailAddress == emailAddress))
                        .OrderByDescending(x => x.EmailAddress == emailAddress && x.PhoneNumber == trimmedPhoneNumber)
                        .ThenByDescending(x => x.EmailAddress == emailAddress || x.PhoneNumber == trimmedPhoneNumber)
                        .ThenBy(x => x.Name)
                        .Take(10)
                        .ProjectTo<PossibleCustomerViewModel>(_mapper.ConfigurationProvider)
                        .ToArrayAsync();

            return Ok(results);
        }
    }
}
