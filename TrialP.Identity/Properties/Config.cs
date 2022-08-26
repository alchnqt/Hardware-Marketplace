using IdentityModel;
using IdentityServer4;
using IdentityServer4.Models;

namespace TrialP.Identity.Properties
{
    public static class Config
    {
        public static IEnumerable<ApiResource> GetApisResources() =>
            new List<ApiResource>
            {
                new ApiResource("ApiOne")
                {
                    Scopes = { "ApiOne" }
                },
                new ApiResource("ApiTwo")
                {
                    Scopes = { "ApiTwo" }
                }
            };

        public static IEnumerable<Client> GetClients() =>
            new List<Client>
            {
                new Client()
                {
                    ClientId = "client_id",
                    ClientSecrets = { new Secret("client_secret".ToSha256()) },
                    AllowedGrantTypes = GrantTypes.Hybrid,
                    AllowedScopes = { "ApiOne", "ApiTwo" }
                },
                new Client()
                {
                    ClientId = "client_id_react",
                    ClientSecrets = { new Secret("client_secret_react".ToSha256()) },
                    AllowedGrantTypes = GrantTypes.Implicit,
                    //AllowedGrantTypes = GrantTypes.Code,
                    //RequirePkce = true,
                    //RequireClientSecret = false,
                    RedirectUris = { "https://localhost:3000/profile" },
                    AllowedScopes = 
                    { 
                        "ApiOne", 
                        "ApiTwo", 
                        IdentityServerConstants.StandardScopes.OpenId,
                        IdentityServerConstants.StandardScopes.Profile
                    },
                    PostLogoutRedirectUris = { "https://localhost:3000/login" },
                    AllowAccessTokensViaBrowser = true,
                    AccessTokenLifetime = 60
                }
            };

        public static List<IdentityResource> GetIdentityResources()
        {
            return new List<IdentityResource>
            {
                new IdentityResources.OpenId(),
                new IdentityResources.Profile() 
            };
        }

        public static IEnumerable<ApiScope> ApiScopes =>
            new List<ApiScope>
            {
                new ApiScope("ApiOne", "ApiOne"),
                new ApiScope("ApiTwo", "ApiTwo")
            };
    }
}
