using System;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using SmartMoving.Core;
using SmartMoving.Core.Data.Security;

namespace SmartMoving.Api.Infrastructure
{
    public class CurrentUser : ICurrentUser
    {
        private readonly IHttpContextAccessor _context;

        public Guid Id => new Guid(_context.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier));

        public string DisplayName => _context.HttpContext.User.FindFirstValue(ClaimTypes.Name);

        public string Email => _context.HttpContext.User.FindFirstValue(ClaimTypes.Email);

        public Guid CompanyId => new Guid(_context.HttpContext.User.FindFirstValue(nameof(CompanyId)));

        public CurrentUser(IHttpContextAccessor context)
        {
            _context = context;
        }
    }
}