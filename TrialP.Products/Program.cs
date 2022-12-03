using TrialP.Products.Controllers;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddHttpClient();
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdministratorsOnly",
    policy => policy.RequireRole("Administrator"));
});
builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", config =>
    {
        config.Authority = "https://localhost:7077";
        config.Audience = "ApiTwo";
    });

builder.Services.AddCors();

var app = builder.Build();

app.UseHttpsRedirection();
app.UseCors(options => options.WithOrigins("http://courseproject:8989").AllowAnyMethod());
app.UseAuthorization();

app.MapControllers();

app.Run();
