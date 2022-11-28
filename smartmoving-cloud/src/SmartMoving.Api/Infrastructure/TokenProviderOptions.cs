namespace SmartMoving.Api.Infrastructure
{
    public class TokenProviderOptions
    {
        public string SecretKey { get; set; }

        public string Issuer { get; set; }

        public string Audience { get; set; }
    }
}