using IdentityModel;
using IdentityServer4;
using IdentityServer4.Models;
using System.Security.Claims;

namespace TrialP.Identity.Properties
{
    public static class Config
    {
        public static IEnumerable<ApiResource> GetApisResources() =>
            new List<ApiResource>
            {
                new ApiResource("ApiOne")
                {
                    Scopes = { "ApiOne" },
                    UserClaims = new string[] { JwtClaimTypes.Role }
                },
                new ApiResource("ApiTwo")
                {
                    Scopes = { "ApiTwo" }
                },
                new ApiResource("TrialP.Products", "TrialP.Products", new List<string>() { JwtClaimTypes.Role })
            };

        public static IEnumerable<Client> GetClients() =>
            new List<Client>
            {
                new Client()
                {
                    ClientId = "client_id",
                    ClientSecrets = { new Secret("client_secret".ToSha256()) },
                    AllowedGrantTypes = GrantTypes.Implicit,
                    AllowAccessTokensViaBrowser = true,
                    AllowedScopes =
                    {
                        "ApiOne", "ApiTwo", "TrialP.Products",
                        IdentityServerConstants.StandardScopes.OpenId,
                        IdentityServerConstants.StandardScopes.Profile
                    },
                    //AlwaysSendClientClaims = true,
                    //AlwaysIncludeUserClaimsInIdToken = true,
                    RedirectUris = { "https://localhost:7077/" }
                },
                new Client()
                {
                    ClientId = "client_admin_id",
                    ClientSecrets = { new Secret("client_admin_secret".ToSha256()) },
                    AllowedGrantTypes = GrantTypes.HybridAndClientCredentials,
                    AllowedScopes =
                    {
                        "ApiOne", "ApiTwo", "TrialP.Products", "TrialP.Admin",
                        IdentityServerConstants.StandardScopes.OpenId,
                        IdentityServerConstants.StandardScopes.Profile
                    },

                    AlwaysIncludeUserClaimsInIdToken = true,
                    RedirectUris = { "https://localhost:7077/" },
                    RequirePkce = true
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
                        JwtClaimTypes.Role,
                        IdentityServerConstants.StandardScopes.OpenId,
                        IdentityServerConstants.StandardScopes.Profile
                    },
                    AlwaysIncludeUserClaimsInIdToken = true,
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
                new ApiScope("ApiTwo", "ApiTwo"),
                new ApiScope("TrialP.Products", "TrialP.Products")
            };
    }
}
