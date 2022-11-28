using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using Should;
using SmartMoving.Api.Features.Customers.Common;
using SmartMoving.Api.Features.Customers.GetCustomers;
using SmartMoving.Api.Features.Paging;
using SmartMoving.Core.Data.Core;
using SmartMoving.Data.Contexts;
using SmartMoving.IntegrationSpecs.Builders;
using SmartMoving.IntegrationSpecs.Helpers;
using SmartMoving.IntegrationSpecs.Infrastructure;
using SpecsFor.Core.ShouldExtensions;

namespace SmartMoving.IntegrationSpecs.SmartMoving.Api.Features.Customers.GetCustomers
{
    public class GetCustomersControllerSpecs
    {
        public class WhenGettingCustomerDetails : SpecsForAsync<GetCustomersController>, ICurrentUserCustomer
        {
            private Customer _customer;
            private ActionResult<CustomerDetailsViewModel> _response;
            private CustomerDetailsViewModel _result;

            public AppDbContext Context { get; set; }

            protected override async Task GivenAsync()
            {
                _customer = await Context.BuildCustomer(x =>
                                         {
                                             x.EmployeeNumber = "1010191818232334422";
                                             x.Address = "123 Customer Address";
                                             x.EmailAddress = "test@dummy.com";
                                             x.HasAccount = false;
                                             x.Name = "MC Movesalot";
                                             x.PhoneNumber = "1234567890";
                                             x.PhoneType = PhoneType.Mobile;
                                             x.SecondaryPhoneNumbers = new[]
                                             {
                                                 new SecondaryPhoneNumber
                                                 {
                                                     PhoneNumber = "9876543210",
                                                     PhoneType = PhoneType.Home
                                                 }
                                             };
                                         })
                                         .FinishAsync();

                // other customer
                // await Context.BuildCustomer().FinishAsync();

                await Context.SaveChangesAsync();
            }

            protected override async Task WhenAsync()
            {
                _response = await SUT.GetCustomerDetails(_customer.Id);
                _result = _response.TryGetObjectFromResult();
            }

            [Test]
            public void ThenItReturnsOk()
            {
                _response.Result.ShouldBeType<OkObjectResult>();
            }

            [Test]
            public void ThenItPopulatesOtherAttributesCorrectly()
            {
                _result.ShouldLookLike(() => new CustomerDetailsViewModel
                {
                    EmployeeNumber = "1010191818232334422",
                    Address = "123 Customer Address",
                    EmailAddress = "test@dummy.com",
                    HasAccount = false,
                    Name = "MC Movesalot",
                    PhoneNumber = "1234567890",
                    PhoneType = PhoneType.Mobile,
                    SecondaryPhoneNumbers = new[]
                    {
                        new SecondaryPhoneNumber
                        {
                            PhoneNumber = "9876543210",
                            PhoneType = PhoneType.Home
                        }
                    }
                });
            }
        }

        public class WhenGettingCustomers : SpecsForAsync<GetCustomersController>, ICurrentUserCustomer
        {
            private Customer _targetCustomer;
            private ActionResult<PageViewModel<CustomerSummaryViewModel>> _response;
            private PageViewModel<CustomerSummaryViewModel> _results;

            public AppDbContext Context { get; set; }

            protected override async Task GivenAsync()
            {
                Context.Customers.RemoveRange(await Context.Customers.ToListAsync());

                _targetCustomer = await Context.BuildCustomer(x =>
                                               {
                                                   x.CreatedAtUtc = DateTimeOffset.UtcNow;
                                                   x.EmailAddress = "test@dummy.com";
                                                   x.Name = "Dummy Customer";
                                                   x.EmployeeNumber = "1010191818232334422";
                                                   x.HasAccount = false;
                                               })
                                               .FinishAsync();

                await Context.BuildAppUser(x => x.DisplayName = "John Smith")
                             .FinishAsync();

                await Context.BuildCustomer(x =>
                             {
                                 x.Name = "Other Customer";
                                 x.EmployeeNumber = "2222222222222222";
                                 x.CreatedAtUtc = DateTimeOffset.UtcNow.AddDays(-5);
                             })
                             .FinishAsync();

                await Context.SaveChangesAsync();
            }

            protected override async Task WhenAsync()
            {
                _response = await SUT.SearchAll(Array.Empty<CustomerSearchCriteriaForm>(), new PageRequestModel { Page = 1 });
                _results = _response.TryGetObjectFromResult();
            }

            [Test]
            public void ThenItReturnsOk()
            {
                _response.Result.ShouldBeType<OkObjectResult>();
            }

            [Test]
            public void ThenCorrectResultsAreReturnedInTheRightOrder()
            {
                _results.PageResults.Select(x => x.Name)
                        .ToArray()
                        .ShouldLookLike(new[]
                        {
                            "Dummy Customer",
                            "Other Customer"
                        });
            }

            [Test]
            public void TheGeneralPropertiesAreCorrect()
            {
                _results.PageResults.Single(x => x.Id == _targetCustomer.Id)
                        .ShouldLookLike(() => new CustomerSummaryViewModel
                        {
                            CreatedAtUtc = Some.DateTimeNear(DateTimeOffset.UtcNow),
                            EmailAddress = "test@dummy.com",
                            Name = "Dummy Customer",
                            HasAccount = false,
                            EmployeeNumber = "1010191818232334422"
                        });
            }
        }
    }
}