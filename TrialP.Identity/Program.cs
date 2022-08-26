using IdentityServer4.EntityFramework.DbContexts;
using IdentityServer4.EntityFramework.Mappers;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Reflection;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using TrialP.Identity.Database;
using TrialP.Identity.Properties;

var builder = WebApplication.CreateBuilder(args);

ConfigurationManager configuration = builder.Configuration; // allows both to access and to set up the config
IWebHostEnvironment environment = builder.Environment;


var filePath = Path.Combine(environment.ContentRootPath, "identity.pfx");
var cert = new X509Certificate2(filePath, "1234");

var migrationsAssembly = typeof(Program).GetTypeInfo().Assembly.GetName().Name;
const string connectionString = @"Data Source=localhost;database=IdentityServer;trusted_connection=yes;";

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddIdentity<IdentityUser, IdentityRole>(config =>
{
    config.Password.RequiredLength = 4;
    config.Password.RequireDigit = false;
    config.Password.RequireNonAlphanumeric = false;
    config.Password.RequireUppercase = false;
    config.Password.RequireLowercase = false;
}).AddEntityFrameworkStores<AppDbContext>().AddDefaultTokenProviders();

builder.Services.AddIdentityServer()
    .AddAspNetIdentity<IdentityUser>()
    .AddConfigurationStore(options =>
    {
        options.ConfigureDbContext = builder =>
            builder.UseSqlServer(connectionString,
                sql => sql.MigrationsAssembly(migrationsAssembly));
    })
    .AddOperationalStore(options =>
    {
        options.ConfigureDbContext = builder =>
            builder.UseSqlServer(connectionString,
                sql => sql.MigrationsAssembly(migrationsAssembly));
        options.EnableTokenCleanup = true;
        options.TokenCleanupInterval = 3600; 
    })
    //.AddInMemoryApiScopes(Config.ApiScopes)
    //.AddInMemoryApiResources(Config.GetApisResources())
    //.AddInMemoryClients(Config.GetClients())
    //.AddInMemoryIdentityResources(Config.GetIdentityResources())
    .AddDeveloperSigningCredential()
    .AddSigningCredential(cert);

builder.Services.AddDbContext<AppDbContext>(config =>
{
    //config.UseInMemoryDatabase("Memory");
    config.UseSqlServer(connectionString);
});

builder.Services.ConfigureApplicationCookie(config =>
{
    config.Cookie.Name = "IdentityServer.Cookie";
    config.LoginPath = "/api/auth/login";
    config.LogoutPath = "/api/auth/logout";
});



var app = builder.Build();

//using (var scope = app.Services.CreateScope())
//{
//    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();

//    var user = new IdentityUser("bob");
//    userManager.CreateAsync(user, "1234").GetAwaiter().GetResult();

//    scope.ServiceProvider.GetRequiredService<PersistedGrantDbContext>().Database.Migrate();
//    var context = scope.ServiceProvider.GetRequiredService<ConfigurationDbContext>();
//    context.Database.Migrate();
//    if (!context.Clients.Any())
//    {
//        foreach (var client in Config.GetClients())
//        {
//            context.Clients.Add(client.ToEntity());
//        }
//        context.SaveChanges();
//    }

//    if (!context.IdentityResources.Any())
//    {
//        foreach (var resource in Config.GetIdentityResources())
//        {
//            context.IdentityResources.Add(resource.ToEntity());
//        }
//        context.SaveChanges();
//    }

//    if (!context.ApiScopes.Any())
//    {
//        foreach (var resource in Config.ApiScopes)
//        {
//            context.ApiScopes.Add(resource.ToEntity());
//        }
//        context.SaveChanges();
//    }
//}

app.UseHttpsRedirection();

app.UseIdentityServer();

app.MapControllers();

app.Run();
