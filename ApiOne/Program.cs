using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddApiVersioning();

builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", config =>
    {
        config.TokenValidationParameters.RoleClaimType = "role";
        config.Authority = "https://localhost:7077";
        config.TokenValidationParameters = new TokenValidationParameters
        {
            ValidAudience = "ApiOne",
            RoleClaimType = "client_role"
        };
    });
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Admin", policy =>
    {
        policy.AddAuthenticationSchemes("Bearer");
        policy.RequireAuthenticatedUser();
        policy.RequireClaim("client_role", "admin");
        //policy.RequireRole(new[] { "Admin" });
    });
});

var app = builder.Build();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});

app.Run();
