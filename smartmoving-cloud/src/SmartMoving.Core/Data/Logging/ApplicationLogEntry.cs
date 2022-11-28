using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SmartMoving.Core.Data.Logging
{
    public class ApplicationLogEntry
    {
        public int Id { get; set; }

        [MaxLength(60)]
        public string RequestId { get; set; }

        [MaxLength(60)]
        public string SessionId { get; set; }

        [MaxLength(50)]
        public string Host { get; set; }

        [MaxLength(300)]
        public string Url { get; set; }

        [MaxLength(300)]
        public string Source { get; set; }

        [MaxLength(100)]
        public string Type { get; set; }

        public string Message { get; set; }

        public string StackTrace { get; set; }

        [MaxLength(60)]
        public string UserName { get; set; }

        public DateTimeOffset CreatedDate { get; set; }
    }

    public class ApplicationLogEntryConfig : IEntityTypeConfiguration<ApplicationLogEntry>
    {
        public void Configure(EntityTypeBuilder<ApplicationLogEntry> builder)
        {
            builder.ToTable("ApplicationLogs", "Logging");

            builder.Property(x => x.CreatedDate)
                .HasDefaultValueSql("GETUTCDATE()");
        }
    }
}