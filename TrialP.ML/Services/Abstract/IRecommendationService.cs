using TrialP.ML.Models;
using WhoBoughtThisItemAlsoBought;

namespace TrialP.ML.Services.Abstract
{
    public interface IRecommendationService
    {
        public List<ProductRecommendation> GetPredictions(uint id);
    }
}
