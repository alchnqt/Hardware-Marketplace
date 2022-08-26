using Microsoft.IdentityModel.Tokens;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;

var authenticationProviderKey = "IdentityApiKey";

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.SetBasePath(builder.Environment.ContentRootPath)
    .AddJsonFile("configuration.json", true, true)
    .AddEnvironmentVariables();

builder.Services.AddOcelot();

builder.Services.AddAuthentication()
    .AddJwtBearer(authenticationProviderKey, config =>
    {
        config.Authority = "https://localhost:7077";
        config.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateAudience = false
        };
    });

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();
app.UseOcelot().Wait();

app.Run();
