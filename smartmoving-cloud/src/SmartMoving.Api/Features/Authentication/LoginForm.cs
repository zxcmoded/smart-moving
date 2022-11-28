using System.ComponentModel.DataAnnotations;

namespace SmartMoving.Api.Features.Authentication
{
    public class LoginForm
    {
        [Required]
        public string EmailAddress { get; set; }

        [Required]
        public string Password { get; set; }

        public bool RememberMe { get; set; }

        public string AppVersion { get; set; }
    }
}