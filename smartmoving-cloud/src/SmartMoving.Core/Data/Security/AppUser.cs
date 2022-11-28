using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartMoving.Core.Data.Core;
using SmartMoving.Core.Extensions;

namespace SmartMoving.Core.Data.Security
{
    public class AppUser : IdentityUser<Guid>
    {
        public static readonly Guid SystemUserId = new Guid("CFFFA9B3-C469-4720-ABAE-D18183CAE250");
        public static readonly Guid CustomerUserId = new Guid("D2F5C9BF-291A-4729-8E8E-B89B4181126A");

        public Guid CompanyId { get; set; }
        public Company Company { get; set; }

        public string DisplayName { get; set; }

        public string MobileNumber { get; set; }

        public DateTimeOffset CreatedAtUtc { get; set; } = DateTimeOffset.UtcNow;

        public string LastLoggedInAppVersion { get; set; }
        public DateTimeOffset? LastLoggedInAt { get; set; }

        public bool Deactivated { get; set; }
        public DateTimeOffset? DeactivatedAtUtc { get; set; }

        public int? HireDate { get; set; }

        public int? TerminationDate { get; set; }

        public string Address { get; set; }

        public Guid? BranchId { get; set; }
        public Branch Branch { get; set; }

        public string Title { get; set; }

        public List<IdentityUserRole<Guid>> UserRoles { get; set; } = new List<IdentityUserRole<Guid>>();

        public static string GenerateRandomPassword()
        {
            var lowerCaseCharacters = Enumerable.Range(0, 26).Select(x => (char)('a' + x)).ToArray();
            var upperCaseCharacters = Enumerable.Range(0, 26).Select(x => (char)('A' + x)).ToArray();
            var allCharacters = lowerCaseCharacters.Union(upperCaseCharacters).ToArray();
            var digits = Enumerable.Range(0, 10).Select(x => (char)('0' + x)).ToArray();

            var password = new List<char>();
            password.Add(upperCaseCharacters.TakeSingleRandom());
            password.AddRange(allCharacters.TakeRandom(6));
            password.Add(digits.TakeSingleRandom());

            return new string(password.ToArray());
        }

        public bool IsTerminatedBy(int date)
        {
            return TerminationDate != null && date >= TerminationDate;
        }

        public void NormalizeEverything(ILookupNormalizer identityNormalizer)
        {
            Email = Email?.Trim().NullIfEmpty();
            UserName = UserName?.Trim().NullIfEmpty();
            PhoneNumber = PhoneNumber.NormalizePhoneNumber();
            MobileNumber = MobileNumber.NormalizePhoneNumber();
            NormalizedUserName = identityNormalizer.NormalizeEmail(UserName);
            NormalizedEmail = identityNormalizer.NormalizeEmail(Email);
        }
    }

    public class AppUserConfig : IEntityTypeConfiguration<AppUser>
    {
        public void Configure(EntityTypeBuilder<AppUser> builder)
        {
            builder.ToTable("Users", "Security");

            builder.HasOne(x => x.Branch)
                   .WithMany()
                   .HasForeignKey(x => x.BranchId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.Company)
                   .WithMany(x => x.Users)
                   .HasForeignKey(x => x.CompanyId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(x => x.UserRoles)
                   .WithOne()
                   .HasForeignKey(x => x.UserId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}