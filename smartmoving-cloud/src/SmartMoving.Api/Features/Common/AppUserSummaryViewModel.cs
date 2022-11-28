using System;
using SmartMoving.Api.Infrastructure.Startup;
using SmartMoving.Core.Data.Security;

namespace SmartMoving.Api.Features.Common
{
    public class AppUserSummaryViewModel : IMapFrom<AppUser>
    {
        public Guid Id { get; set; }

        public string DisplayName { get; set; }

        public string Email { get; set; }

        public string PhoneNumber { get; set; }

        public string Title { get; set; }

        public string DisplayTitle => string.IsNullOrWhiteSpace(Title) ? "Moving Consultant" : Title;
    }
}
