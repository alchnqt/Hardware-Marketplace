using TrialP.Products.Controllers;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
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


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();