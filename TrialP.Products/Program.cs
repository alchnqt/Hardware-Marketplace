using TrialP.Products.Controllers;
using Microsoft.IdentityModel.Tokens;
using System.Configuration;
using TrialP.Products.Models;
using Microsoft.EntityFrameworkCore;
using TrialP.Products.Services.Abstract;
using TrialP.Products.Services.Domain;
using TrialP.Products.Configuration;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddHttpClient("externalService");
builder.Services.AddDbContext<TrialPProductsContext>(options =>
         options.UseSqlServer("Server=localhost;Database=TrialP_Products;Trusted_Connection=True;trustServerCertificate=true;MultipleActiveResultSets=true;"),
         ServiceLifetime.Transient);
builder.Services.Configure<ExternalServiceSettings>(
            builder.Configuration.GetSection("ExternalServiceSettings")
        );
builder.Services.AddTransient<IEmailService, EmailService>();
builder.Services.AddTransient<IExternalApiService, ExternalApiService>();
builder.Services.AddTransient<IProductService, ProductService>();
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
app.UseCors(options => options.AllowAnyOrigin().AllowAnyMethod().AllowAnyMethod().AllowAnyHeader());
app.UseAuthorization();

app.MapControllers();

app.Run();
