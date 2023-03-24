using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json;
using TrialP.Auth;
using TrialP.Auth.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

var connectionString = builder.Configuration.GetConnectionString("Server=localhost;Database=TrialP_IdentityServer;User=sa;Password=1234;trustServerCertificate=true;");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8
                .GetBytes("this is my custom Secret key for authentication")),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });

builder.Services.AddIdentity<IdentityUser, IdentityRole>(options =>
{
    options.User.RequireUniqueEmail = false;
    options.Password = new PasswordOptions()
    {
        RequireDigit = true,
        RequiredLength = 3,
        RequireLowercase = false,
        RequireUppercase = false,
        RequireNonAlphanumeric = false
    };
})
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders();
//builder.Services.AddAuthorization(options =>
//{
//    options.AddPolicy("Admin", policy =>
//    {
//        policy.AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme);
//        policy.RequireAuthenticatedUser();
//        policy.RequireClaim("role", "Admin");
//        //policy.RequireRole(new[] { "Admin" });
//    });
//});

builder.Services.Configure<CookiePolicyOptions>(options =>
{
    // This lambda determines whether user consent for non-essential 
    // cookies is needed for a given request.
    options.CheckConsentNeeded = context => true;

    options.MinimumSameSitePolicy = SameSiteMode.None;
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy",
                    builder =>
                    {
                        builder
                          .AllowAnyMethod()
                          .AllowAnyHeader()
                          .SetIsOriginAllowed(origin => true)
                          .AllowCredentials();
                    });
});
var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

    IdentityResult adminRoleResult;
    IdentityResult customerRoleResult;
    bool adminRoleExists = await roleManager.RoleExistsAsync("Admin");
    if (!adminRoleExists)
    {
        adminRoleResult = await roleManager.CreateAsync(new IdentityRole("Admin"));
    }

    bool customerRoleExists = await roleManager.RoleExistsAsync("Customer");
    if (!customerRoleExists)
    {
        customerRoleResult = await roleManager.CreateAsync(new IdentityRole("Customer"));
    }

    //pre admin
    IdentityUser bob = new IdentityUser() { UserName = "admin_default", Email = "wndrfljnx@gmail.com" };

    IdentityResult bobResult = await userManager.CreateAsync(bob, "1234");
    if (!bobResult.Succeeded)
    {
        IdentityUser bobDelete = await userManager.FindByNameAsync("admin_default");
        if (bobDelete != null)
        {
            await userManager.DeleteAsync(bobDelete);
        }
    }
    bobResult = await userManager.CreateAsync(bob, "1234");
    if (bobResult.Succeeded)
    {
        IdentityUser userToMakeAdmin = await userManager.FindByNameAsync("admin_default");
        if (userToMakeAdmin != null)
        {
            await userManager.AddToRoleAsync(userToMakeAdmin, "Admin");
        }
        await userManager.AddToRoleAsync(userToMakeAdmin, "Admin");
    }

    //pre customer
    IdentityUser alice = new IdentityUser() { UserName = "alice", Email = "alice@gmail.com", PhoneNumber = "+375298889922" };

    IdentityResult aliceResult = await userManager.CreateAsync(alice, "1234");
    if (!aliceResult.Succeeded)
    {
        IdentityUser aliceDelete = await userManager.FindByNameAsync("alice");
        if (aliceDelete != null)
        {
            await userManager.DeleteAsync(aliceDelete);
        }
    }
    aliceResult = await userManager.CreateAsync(alice, "1234");
    if (aliceResult.Succeeded)
    {
        IdentityUser userToMakeCustomer = await userManager.FindByNameAsync("alice");
        if (userToMakeCustomer != null)
        {
            await userManager.AddToRoleAsync(userToMakeCustomer, "Customer");
        }
        await userManager.AddToRoleAsync(userToMakeCustomer, "Customer");
    }
}




app.UseRouting();

app.UseCors("CorsPolicy");

app.UseCookiePolicy();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers().RequireCors("CorsPolicy");

app.Run();