using Microsoft.AspNetCore.Authentication;

namespace TrialP.BotApi.Auth
{
    public class ApiKeyAuthenticationSchemeOptions : AuthenticationSchemeOptions
    {
        public string ApiKey { get; set; }
    }
}
