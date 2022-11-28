using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using NLog;
using NodaTime;
using SmartMoving.Core.Data.Core;
using SmartMoving.Core.Data.Core.CompanySettingTypes;
using SmartMoving.Core.Data.Security;
using SmartMoving.Core.Extensions;
using SmartMoving.Data;
using SmartMoving.Data.Contexts;

namespace SmartMoving.Api.Data
{
    public class CompanyCreationSettings
    {
        public CompanyCreationSettings(string companyName,
            string smsNumber,
            string websiteAddress,
            string customerPortalUrl,
            string phoneNumber,
            string systemEmailAddress,
            string ianaTzdbTimeZone,
            string normalAdminDisplayName = null,
            string normalAdminEmailAddress = null,
            string normalAdminPassword = null,
            string normalAdminMobileNumber = null,
            string platformId = null,
            bool giveNormalAdminAllAccess = false)
        {
            CompanyName = companyName;
            NormalAdminDisplayName = normalAdminDisplayName;
            NormalAdminEmailAddress = normalAdminEmailAddress;
            NormalAdminPassword = normalAdminPassword;
            SmsNumber = smsNumber;
            WebsiteAddress = websiteAddress;
            CustomerPortalUrl = customerPortalUrl;
            PhoneNumber = phoneNumber;
            SystemEmailAddress = systemEmailAddress;
            IanaTzdbTimeZone = ianaTzdbTimeZone;
            NormalAdminMobileNumber = normalAdminMobileNumber;
            PlatformId = platformId ?? string.Empty;
            GiveNormalAdminAllAccess = giveNormalAdminAllAccess;
        }

        public string CompanyName { get; }
        public string NormalAdminDisplayName { get; }
        public string NormalAdminEmailAddress { get; }
        public string NormalAdminPassword { get; }
        public string NormalAdminMobileNumber { get; }

        /// <summary>
        /// This is just for admin accounts on our local machines.
        /// </summary>
        public bool GiveNormalAdminAllAccess { get; }

        public string SmsNumber { get; }
        public string WebsiteAddress { get; }
        public string CustomerPortalUrl { get; }
        public string PhoneNumber { get; }
        public string SystemEmailAddress { get; }
        public string IanaTzdbTimeZone { get; }

        /// <summary>
        /// Becomes "RandomId" on the table itself.
        /// </summary>
        public string PlatformId { get; }

        public static CompanyCreationSettings DemoCompanySettings => new CompanyCreationSettings(
            // ReSharper disable ArgumentsStyleStringLiteral
            companyName: "Speedy Moving",
            smsNumber: "+5555551234",
            websiteAddress: "http://www.speedy-moving.com",
            customerPortalUrl: "http://localhost:8082",
            phoneNumber: "5555551234",
            systemEmailAddress: "contact@speedy-moving.com",
            ianaTzdbTimeZone: "America/Chicago",
            platformId: "1111111",
            normalAdminDisplayName: "Admin User",
            normalAdminEmailAddress: "really-good@interviewee.com",
            normalAdminPassword: "My@Great99Password",
            giveNormalAdminAllAccess: true);
        // ReSharper restore ArgumentsStyleStringLiteral
    }

    public class CompanyDataInitializer
    {
        private static readonly Logger Logger = LogManager.GetCurrentClassLogger();
        private readonly AppDbContext _context;
        private readonly UserManager<AppUser> _userManager;
        private Company _company;

        public CompanyDataInitializer(AppDbContext context, UserManager<AppUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task<(Guid companyId, string platformId)> Execute(CompanyCreationSettings companyCreationSettings)
        {
            var platformId = companyCreationSettings.PlatformId;

            _context.RemoveCompanyFilter();

            await EnsureCompany(companyCreationSettings, platformId);

            await EnsureDefaultRoles();

            if (!string.IsNullOrWhiteSpace(companyCreationSettings.NormalAdminEmailAddress) && !string.IsNullOrWhiteSpace(companyCreationSettings.NormalAdminPassword))
            {
                await EnsureCompanyNormalAdminUser(companyCreationSettings.NormalAdminDisplayName,
                    companyCreationSettings.NormalAdminEmailAddress,
                    companyCreationSettings.NormalAdminPassword,
                    companyCreationSettings.NormalAdminMobileNumber);
            }

            await EnsureBranch();

            await EnsureSomeInterviewData();

            return (_company.Id, _company.RandomId);
        }

        private async Task EnsureSomeInterviewData()
        {
            if (await _context.Customers.AnyAsync())
            {
                return;
            }

            var customer1 = new Customer
            {
                Name = "John Doe",
                PhoneNumber = "+5555551234",
                EmployeeNumber = "123456789098765432123",
                PhoneType = PhoneType.Office,
                EmailAddress = "john.doe@dummy.com",
                HasAccount = false,
                CompanyId = _company.Id,
            };

            await _context.Customers.AddAsync(customer1);

            var customer2 = new Customer
            {
                Name = "Jane Doe",
                EmployeeNumber = "09876543211234567890",
                PhoneNumber = "+5555554321",
                PhoneType = PhoneType.Home,
                EmailAddress = "jane.doe@dummy.com",
                HasAccount = true,
                CompanyId = _company.Id,
            };

            await _context.Customers.AddAsync(customer2);

            await _context.SaveChangesAsync();
        }

        private async Task EnsureDefaultRoles()
        {
            var currentRoles = await _context.Roles.Where(x => x.CompanyId == _company.Id).ToArrayAsync();

            foreach (var role in EnumHelper.GetAll<DefaultRole>())
            {
                var currentRole = currentRoles.FirstOrDefault(x => x.NormalizedName == AppRole.NormalizeName(role.ToString()));

                if (currentRole is null)
                {
                    currentRole = new AppRole(role.Titleize(), DefaultPermissions.For(role)) { CompanyId = _company.Id };
                    currentRole.SetPermissions(DefaultPermissions.For(role));
                    _context.Roles.Add(currentRole);
                }
            }

            await _context.SaveChangesAsync();
        }

        private async Task EnsureCompanyNormalAdminUser(string normalAdminDisplayName, string normalAdminEmailAddress, string normalAdminPassword,
            string normalAdminMobileNumber)
        {
            if (!await _context.Users.AnyAsync(x => x.Email == normalAdminEmailAddress))
            {
                var normalAdminUser = new AppUser
                {
                    UserName = normalAdminEmailAddress,
                    Email = normalAdminEmailAddress,
                    EmailConfirmed = true,
                    DisplayName = normalAdminDisplayName,
                    CompanyId = _company.Id,
                    MobileNumber = normalAdminMobileNumber,
                };

                if (_userManager is null)
                {
                    Logger.Error("User manager is null! This should only be happening in integration specs.");

                    _context.Users.Add(normalAdminUser);
                }
                else
                {
                    var result = await _userManager.CreateAsync(normalAdminUser, normalAdminPassword);

                    if (!result.Succeeded)
                    {
                        var errors = string.Join("\r\n", result.Errors.Select(x => x.Description));
                        throw new Exception($"One or more errors occurred while creating the normal admin user: {errors}");
                    }
                }

                var adminRole = await _context.Roles.SingleAsync(x =>
                    x.CompanyId == _company.Id && x.NormalizedName == AppRole.NormalizeName(DefaultRole.Admin.ToString()));

                _context.UserRoles.Add(new IdentityUserRole<Guid>
                {
                    UserId = normalAdminUser.Id,
                    RoleId = adminRole.Id
                });

                await _context.SaveChangesAsync();
            }
        }

        private async Task EnsureCompany(CompanyCreationSettings settings, string platformId)
        {
            if (!DateTimeZoneProviders.Tzdb.Ids.Contains(settings.IanaTzdbTimeZone))
            {
                throw new InvalidOperationException($"{settings.IanaTzdbTimeZone} is not a valid timezone");
            }

            if (!await _context.Companies.AnyAsync(x => x.Name == settings.CompanyName && x.RandomId == platformId))
            {
                var address = new Address
                {
                    Street = "STREET",
                    City = "CITY",
                    State = "ST",
                    ZipCode = "55555"
                };

                var company = new Company
                {
                    Name = settings.CompanyName,
                    RandomId = platformId,
                    PrimaryColor = "#146dc0",
                    PhoneNumber = settings.PhoneNumber,
                    StateLicenseNumber = "0",
                    LogoUrl = string.Empty,
                    CustomerPortalUrl = settings.CustomerPortalUrl,
                    WebsiteAddress = settings.WebsiteAddress,
                    SmsNumber = settings.SmsNumber,
                    IanaTzdbTimeZone = settings.IanaTzdbTimeZone,
                    Currency = Currency.USD,
                    Address = address,
                    EmailSettings = new CompanyEmailSettings
                    {
                        BackgroundColor = "#E6EBF5",
                        FontColor = "#74787E",
                        SystemEmailFromAddress = settings.SystemEmailAddress,
                        Footer = $@"
<div class=""sub align-center"">
	{settings.CompanyName} 
	<span class=""plain-text"">
		<br/>{address.Street}
		<br/>{address.City}, {address.State}  {address.ZipCode}
		<br/><a class=""plain-text"" href=""{settings.WebsiteAddress}"">{settings.WebsiteAddress.TrimAllStart("https://", "http://")}</a>
	</span>
</div>
"
                    },
                };

                company.NormalizeEverything();

                _context.Companies.Add(company);

                await _context.SaveChangesAsync();
            }

            _company = await _context.Companies
                                     .SingleAsync(x => x.Name == settings.CompanyName && x.RandomId == platformId);
        }

        private async Task EnsureBranch()
        {
            if (!await _context.Branches.AnyAsync(x => x.CompanyId == _company.Id))
            {
                _context.Branches.Add(new Branch
                {
                    Name = "Main Office",
                    CompanyId = _company.Id,
                    IsPrimary = true,
                    DispatchLocation = new BranchAddress
                    {
                        FullAddress = "STREET, CITY ST 55555",
                        Street = "STREET",
                        City = "CITY",
                        State = "ST",
                        Zip = "55555",
                        Lat = 33.0098248m,
                        Lng = -96.6906455m,
                    },
                    MailingAddress = new Address(), // Don't override company by default
                });

                await _context.SaveChangesAsync();
            }
        }
    }
}