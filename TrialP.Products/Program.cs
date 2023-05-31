using TrialP.Products.Controllers;
using Microsoft.IdentityModel.Tokens;
using System.Configuration;
using TrialP.Products.Models;
using Microsoft.EntityFrameworkCore;
using TrialP.Products.Services.Abstract;
using TrialP.Products.Services.Domain;
using TrialP.Products.Configuration;
using Microsoft.Extensions.Options;
using System.Text;
using Thinktecture.EntityFrameworkCore;
using Thinktecture;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddHttpClient("externalService");
builder.Services.AddDbContext<TrialPProductsContext>(options =>
         options.UseSqlServer("Server=localhost;Database=TrialP_Products;Trusted_Connection=True;trustServerCertificate=true;MultipleActiveResultSets=true;", sqlOptions =>
         {
             sqlOptions.AddRowNumberSupport();
         }),
         ServiceLifetime.Transient);
builder.Services.Configure<ExternalServiceSettings>(
            builder.Configuration.GetSection("ExternalServiceSettings")
        );
builder.Services.AddTransient<IEmailService, EmailService>();
builder.Services.AddTransient<IExternalApiService, ExternalApiService>();
builder.Services.AddTransient<IProductService, ProductService>();
builder.Services.AddTransient<ISearchService, SearchService>();
builder.Services.AddTransient<IShopService, ShopService>(); 
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddHttpClient();

//builder.Services.AddHttpsRedirection(options =>
//{
//    options.RedirectStatusCode = StatusCodes.Status307TemporaryRedirect;
//    options.HttpsPort = 44344;
//});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdministratorsOnly",
    policy => policy.RequireRole("Administrator"));
});
builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", config =>
    {
        //config.Authority = "http://localhost:8099/";
        config.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = false,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8
               .GetBytes("this is my custom Secret key for authentication")),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy",
                    builder =>
                    {
                        builder
                          .WithOrigins("http://rhino.acme.com:8099")
                          //.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader()
                          .AllowCredentials();
                    });
});

var app = builder.Build();

app.UseHttpsRedirection();
app.UseCors("CorsPolicy");
app.UseAuthorization();

app.MapControllers();

app.Run();
