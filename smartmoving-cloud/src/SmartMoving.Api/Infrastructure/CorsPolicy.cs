namespace SmartMoving.Api.Infrastructure
{
    public class CorsPolicy
    {
        /// <summary>
        /// This policy is used for the client app.
        /// </summary>
        internal const string SmClient = "SmartMoving Client";

        /// <summary>
        /// Public policy - use sparingly as we want all endpoints to have some sort of restrictions whenever possible.
        /// </summary>
        internal const string SmPublic = "SmartMoving Public";
    }
}