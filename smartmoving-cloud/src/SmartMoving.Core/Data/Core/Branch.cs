using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartMoving.Core.Data.Core.CompanySettingTypes;
using SmartMoving.Core.Extensions;

namespace SmartMoving.Core.Data.Core
{
    public class Branch : EntityBase, IBelongToCompany
    {
        public string Name { get; set; }

        public string UniqueSlug => Name.ToLower().TrimNonAlphaNumeric().Replace(" ", "-");

        public string PhoneNumber { get; set; }

        public Guid CompanyId { get; set; }
        public Company Company { get; set; }

        public BranchAddress DispatchLocation { get; set; } = new BranchAddress();

        public Address MailingAddress { get; set; } = new Address();

        public bool IsPrimary { get; set; }

        public string CompanyName { get; set; }

        public string WebsiteAddress { get; set; }

        public string CustomerPortalUrl { get; set; }

        public string PrimaryColor { get; set; }

        public string LogoUrl { get; set; }

        public SocialMediaSettings SocialMediaSettings { get; set; } = new SocialMediaSettings();

        public string SmsNumber { get; set; }
    }

    public class BranchConfig : IEntityTypeConfiguration<Branch>
    {
        public void Configure(EntityTypeBuilder<Branch> builder)
        {
            builder.ToTable("Branches", "Core");

            builder.Property(x => x.Name).HasMaxLength(250).IsRequired();

            builder.Property(x => x.CompanyName).HasMaxLength(250);

            builder.Property(x => x.PhoneNumber).HasMaxLength(20);

            builder.Property(x => x.SmsNumber).HasMaxLength(20);

            builder.Property(x => x.WebsiteAddress).HasMaxLength(1000);

            builder.Property(x => x.CustomerPortalUrl).HasMaxLength(1000);

            builder.Property(x => x.PrimaryColor).HasMaxLength(10);

            builder.Property(x => x.LogoUrl).HasMaxLength(1000);

            builder.OwnsOne(x => x.SocialMediaSettings);

            builder.EntityBelongsToCompany(x => x.Company, x => x.Branches);

            builder.OwnsOne(x => x.DispatchLocation, owned =>
            {
                owned.Property(x => x.FullAddress).HasMaxLength(500);
                owned.Property(x => x.Street).HasMaxLength(100);
                owned.Property(x => x.Unit).HasMaxLength(100);
                owned.Property(x => x.City).HasMaxLength(100);
                owned.Property(x => x.State).HasMaxLength(100);
                owned.Property(x => x.Zip).HasMaxLength(100);
                owned.Property(x => x.Lat).HasLatLngColumnType();
                owned.Property(x => x.Lng).HasLatLngColumnType();
            });

            builder.OwnsOne(x => x.MailingAddress, owned =>
            {
                owned.Property(x => x.Street).HasMaxLength(100);
                owned.Property(x => x.City).HasMaxLength(100);
                owned.Property(x => x.State).HasMaxLength(100);
                owned.Property(x => x.ZipCode).HasMaxLength(100);
            });
        }
    }
}