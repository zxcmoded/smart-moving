using System;
using System.Collections.Generic;

namespace SmartMoving.Api.Features.Authentication
{
    public class LoginResult
    {
        public Guid Id { get; set; }

        public DateTimeOffset? UserCreatedAtUtc { get; set; }

        public string Token { get; set; }

        public string DisplayName { get; set; }

        public string UserTitle { get; set; }

        public string Email { get; set; }

        public string PhoneNumber { get; set; }

        public string RoleName { get; set; }

        public string Permissions { get; set; }

        public Guid CompanyId { get; set; }

        public string CompanyName { get; set; }

        public string PlatformId { get; set; }

        public DateTimeOffset CompanyCreatedAtUtc { get; set; }
    }
}