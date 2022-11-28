using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using Should;
using SmartMoving.Api.Features.Customers.Common;
using SmartMoving.Api.Features.Customers.GetCustomers;
using SmartMoving.Api.Features.Customers.UpdateCustomer;
using SmartMoving.Api.Features.Paging;
using SmartMoving.Core.Data.Core;
using SmartMoving.Data.Contexts;
using SmartMoving.IntegrationSpecs.Builders;
using SmartMoving.IntegrationSpecs.Helpers;
using SmartMoving.IntegrationSpecs.Infrastructure;
using SpecsFor.Core.ShouldExtensions;

namespace SmartMoving.IntegrationSpecs.SmartMoving.Api.Features.Customers.GetCustomers
{
    public class UpdateCustomerControllerSpecs
    {
        public class WhenUpdatingCustomerDetails : SpecsForAsync<UpdateCustomerController>, ICurrentUserCustomer
        {
            private Guid _id;
            private Customer _customer;
            private ActionResult<CustomerDetailsViewModel> _response;
            private CustomerDetailsViewModel _result;

            public AppDbContext Context { get; set; }

            protected override async Task GivenAsync()
            {
                _customer = await Context.BuildCustomer(x =>
                                         {
                                             x.EmployeeNumber = "09471906994123";
                                             x.Address = "Blk 11 lot 14";
                                             x.EmailAddress = "kenneth@test.com";
                                             x.HasAccount = false;
                                             x.Name = "Kenneth Test";
                                             x.PhoneNumber = "09471906994";
                                             x.PhoneType = PhoneType.Mobile;
                                             x.SecondaryPhoneNumbers = new[]
                                             {
                                                 new SecondaryPhoneNumber
                                                 {
                                                     PhoneNumber = "09198213435",
                                                     PhoneType = PhoneType.Home
                                                 }
                                             };
                                         })
                                         .FinishAsync();

                await Context.SaveChangesAsync();

                // get the id base on given employee id
                _id = await Context.Customers.Where(z => z.EmployeeNumber == "09471906994123").Select(z => z.Id).FirstOrDefaultAsync();
            }

            protected override async Task WhenAsync()
            {
                _response = await SUT.UpdateCustomer(_id, new EditCustomerForm
                {
                    EmployeeNumber = "111111111111",
                    Address = "Blk 11 lot 14",
                    EmailAddress = "kenneth@test.com",
                    Name = "Kenneth Montealto",
                    PhoneNumber = "09471906994",
                    PhoneType = PhoneType.Mobile,
                    SecondaryPhoneNumbers = new[]
                    {
                        new SecondaryPhoneNumber
                        {
                            PhoneNumber = "09198213435",
                            PhoneType = PhoneType.Home
                        }
                    }
                });
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
                    EmployeeNumber = "111111111111",
                    Address = "Blk 11 lot 14",
                    EmailAddress = "kenneth@test.com",
                    HasAccount = false,
                    Name = "Kenneth Montealto",
                    PhoneNumber = "09471906994",
                    PhoneType = PhoneType.Mobile,
                    SecondaryPhoneNumbers = new[]
                    {
                        new SecondaryPhoneNumber
                        {
                            PhoneNumber = "09198213435",
                            PhoneType = PhoneType.Home
                        }
                    }
                });
            }
        }
    }
}