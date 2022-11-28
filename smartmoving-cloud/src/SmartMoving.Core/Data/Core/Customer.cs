using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartMoving.Core.Extensions;

namespace SmartMoving.Core.Data.Core
{
    public class Customer : EntityBase, IBelongToCompany
    {
        public string Name { get; set; }

        public string PhoneNumber { get; set; }

        public PhoneType? PhoneType { get; set; }

        // We can't do a search across SecondaryPhoneNumber directly since it has a value converter.
        public string SecondaryPhoneNumbersIndex { get; set; }
        public SecondaryPhoneNumber[] SecondaryPhoneNumbers { get; set; } = Array.Empty<SecondaryPhoneNumber>();

        public string EmailAddress { get; set; }

        public bool HasAccount { get; set; }

        public string Address { get; set; }

        public Guid CompanyId { get; set; }
        public string EmployeeNumber { get; set; }

        public void UpdateSecondaryPhoneNumberIndex()
        {
            // Why wrap it in "|"?  So you can do an exact-match search with a Contains/Like query. 
            SecondaryPhoneNumbersIndex = SecondaryPhoneNumbers?.Select(x => $"|{x.PhoneNumber.TrimNonDigits()}|").JoinNonNullEntries(string.Empty) ?? string.Empty;
        }

        public void NormalizePhoneNumbers()
        {
            PhoneNumber = PhoneNumber.NormalizePhoneNumber().TrimSafe();
            if (string.IsNullOrWhiteSpace(PhoneNumber))
            {
                PhoneType = null;
            }

            foreach (var secondaryPhoneNumber in SecondaryPhoneNumbers)
            {
                secondaryPhoneNumber.PhoneNumber = secondaryPhoneNumber.PhoneNumber.NormalizePhoneNumber().TrimSafe();
                if (string.IsNullOrWhiteSpace(secondaryPhoneNumber.PhoneNumber))
                {
                    secondaryPhoneNumber.PhoneType = null;
                }
            }

            UpdateSecondaryPhoneNumberIndex();
        }

        public void NormalizeEverything()
        {
            Name = Name.Trim();
            NormalizePhoneNumbers();
            EmailAddress = EmailAddress?.Trim().NullIfEmpty();
        }
    }

    public class CustomerConfig : IEntityTypeConfiguration<Customer>
    {
        public void Configure(EntityTypeBuilder<Customer> builder)
        {
            builder.ToTable("Customers", "Core");

            builder.Property(x => x.Name).HasMaxLength(250).IsRequired();
            

            builder.Property(x => x.Address).HasMaxLength(500);

            builder.Property(x => x.EmailAddress).HasMaxLength(100);

            builder.Property(x => x.PhoneNumber).HasMaxLength(50);

            builder.Property(x => x.PhoneType)
                   .HasMaxLength(20)
                   .HasConversion(x => x.ToString(), x => Enum.Parse<PhoneType>(x));

            builder.Property(x => x.SecondaryPhoneNumbers)
                   .HasMaxLength(1000)
                   .HasDefaultValueSql("'[]'")
                   .StoreAsJson();

            builder.Property(x => x.SecondaryPhoneNumbersIndex).HasMaxLength(300);
            
            builder.Property(x => x.EmployeeNumber).HasMaxLength(50).IsRequired();

            builder.EntityBelongsToCompany();
        }
    }
}