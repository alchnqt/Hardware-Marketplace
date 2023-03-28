using TrialP.ML.Services.Abstract;
using TrialP.ML.Services.Domain;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddTransient<IRecommendationService, RecommendationService>();

var app = builder.Build();

app.UseAuthorization();

app.MapControllers();

app.Run();