using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TrialP.ML.Models;
using TrialP.ML.Services.Abstract;

namespace TrialP.ML.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class MLController : ControllerBase
    {
        private readonly IRecommendationService _recommendationService;

        public MLController(IRecommendationService recommendationService)
        {
            _recommendationService = recommendationService;
        }

        [HttpGet]
        public List<ProductRecommendation> GetTop3Recommendations(uint id)
        {
            return _recommendationService.GetPredictions(id);
        }
    }
}
