using Microsoft.AspNetCore.Components.Forms;
using Microsoft.ML;
using Microsoft.ML.Data;
using System.Data;
using System.Reflection;
using TrialP.ML.Models;
using TrialP.ML.Services.Abstract;
using WhoBoughtThisItemAlsoBought;

namespace TrialP.ML.Services.Domain
{
    public class RecommendationService : IRecommendationService
    {
        private const int MAX_ROWS = 262111;
        public List<ProductRecommendation> GetPredictions(uint id)
        {
            MLContext mlContext = new MLContext();
            DataViewSchema modelSchema;
            ITransformer trainedModel = mlContext.Model.Load("model.zip", out modelSchema);
            var predictionengine = mlContext.Model.CreatePredictionEngine<ProductInfo, ProductPrediction>(trainedModel);
            List<ProductRecommendation> predictions = new();
            var top4 = (from m in Enumerable.Range(1, 262111)
                        let p = predictionengine.Predict(
                           new ProductInfo()
                           {
                               ProductID = id,
                               CombinedProductID = unchecked((uint)m)
                           })
                        orderby p.Score descending
                        select new ProductRecommendation() { ProductId = unchecked((uint)m), Score = p.Score }).Take(4);
            return top4.ToList();
        }
    }
}
