using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartMoving.Core.Data.Core.CompanySettingTypes;
using SmartMoving.Core.Data.Security;
using SmartMoving.Core.Extensions;

namespace SmartMoving.Core.Data.Core
{
    public class Company : EntityBase
    {
        public static Guid SystemCompanyId => new Guid("0313b7ff-c255-43ce-9460-36e5ff3114c7");

        public string Name { get; set; }

        public string UniqueSlug => GenerateUniqueSlug(Name, RandomId);

        /// <summary>
        /// Poorly named, we refer to it as PlatformId now.
        /// </summary>
        /// <value></value>
        public string RandomId { get; set; }

        public string PhoneNumber { get; set; }

        public string SmsNumber { get; set; }

        public string PrimaryColor { get; set; }

        public string LogoUrl { get; set; }

        public string StateLicenseNumber { get; set; }

        public Address Address { get; set; } = new Address();

        public string WebsiteAddress { get; set; }

        public string CustomerPortalUrl { get; set; }

        public SocialMediaSettings SocialMediaSettings { get; set; } = new SocialMediaSettings();

        public CompanyEmailSettings EmailSettings { get; set; } = new CompanyEmailSettings();

        public LogoDisplayMode LogoDisplay { get; set; } = LogoDisplayMode.Landscape;

        public string IanaTzdbTimeZone { get; set; }

        public bool IsEnabled { get; set; } = true;

        public Currency Currency { get; set; } = Currency.USD;

        public IList<AppUser> Users { get; set; } = new List<AppUser>();

        public IList<Branch> Branches { get; set; } = new List<Branch>();

        public static string GenerateUniqueSlug(string companyName, string companyRandomId)
        {
            return $"{companyName.ToLower().TrimNonAlphaNumeric().Replace(" ", "-")}-{companyRandomId}";
        }

        /// <summary>
        /// Just being careful on the user-entered data. None of these have actually ever went over.
        /// </summary>
        public void NormalizeEverything()
        {
            Name = Name?.Left(250);
            StateLicenseNumber = StateLicenseNumber?.Left(250);
            PhoneNumber = PhoneNumber?.Left(20);
            WebsiteAddress = WebsiteAddress?.Left(1000);
            LogoUrl = LogoUrl?.Left(1000);
            Address?.NormalizeEverything();
        }
    }

    public enum LogoDisplayMode
    {
        Portrait,
        Landscape
    }

    public class CompanyConfig : IEntityTypeConfiguration<Company>
    {
        public void Configure(EntityTypeBuilder<Company> builder)
        {
            builder.ToTable("Companies", "Core");

            builder.Property(x => x.Name).HasMaxLength(250).IsRequired();

            builder.Property(x => x.StateLicenseNumber).HasMaxLength(250);

            builder.Property(x => x.RandomId).HasMaxLength(20);

            builder.Property(x => x.PhoneNumber).HasMaxLength(20);

            builder.Property(x => x.SmsNumber).HasMaxLength(20).IsRequired();

            builder.Property(x => x.IanaTzdbTimeZone).HasMaxLength(100);

            builder.Property(x => x.WebsiteAddress).HasMaxLength(1000);

            builder.Property(x => x.CustomerPortalUrl).HasMaxLength(1000);

            builder.Property(x => x.PrimaryColor).HasMaxLength(10);

            builder.OwnsOne(x => x.SocialMediaSettings);

            builder.OwnsOne(x => x.Address, owned =>
            {
                owned.Property(x => x.Street).HasMaxLength(100);
                owned.Property(x => x.City).HasMaxLength(100);
                owned.Property(x => x.State).HasMaxLength(100);
                owned.Property(x => x.ZipCode).HasMaxLength(100);
            });

            builder.OwnsOne(x => x.EmailSettings, owned =>
            {
                owned.Property(x => x.SystemEmailFromAddress).HasMaxLength(100);
                owned.Property(x => x.BackgroundColor).HasMaxLength(10);
                owned.Property(x => x.FontColor).HasMaxLength(10);
                owned.Property(x => x.InboundAddress).HasMaxLength(100);
                owned.Property(x => x.PostmarkServerKey).HasMaxLength(100);
            });

            builder.Property(x => x.LogoDisplay).HasMaxLength(50).HasDefaultValueSql($"'{LogoDisplayMode.Landscape}'").StoreEnumAsString();

            builder.Property(x => x.LogoUrl).HasMaxLength(1000);

            builder.Property(x => x.IsEnabled).HasDefaultValue(true).ValueGeneratedNever();

            builder.Property(x => x.Currency).HasMaxLength(10).HasDefaultValueSql($"'{Currency.USD}'").StoreEnumAsString();
        }
    }
}