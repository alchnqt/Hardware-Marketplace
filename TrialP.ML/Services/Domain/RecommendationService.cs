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
            float score = 0.0f;
            uint combiniedProductInfo = 1;


            var top3 = (from m in Enumerable.Range(1, 262111)
                        let p = predictionengine.Predict(
                           new ProductInfo()
                           {
                               ProductID = id,
                               CombinedProductID = unchecked((uint)m)
                           })
                        orderby p.Score descending
                        select new ProductRecommendation() { ProductId = unchecked((uint)m), Score = p.Score }).Take(5);

            return top3.ToList();

            //do
            //{
            //    var prediction = predictionengine.Predict(
            //    new ProductInfo()
            //    {
            //        ProductID = id,
            //        CombinedProductID = combiniedProductInfo
            //    });

            //    if (!float.IsNaN(prediction.Score))
            //    {
            //        score = prediction.Score;
            //        predictions.Add(new ProductRecommendation { ProductId = combiniedProductInfo, Score = score });
            //        if (predictions.Count() == 4 && combiniedProductInfo != MAX_ROWS)
            //        {
            //            predictions.RemoveAll(x => (decimal)x.Score == (decimal)predictions.Min(x => x.Score));
            //        }
            //    }
            //    combiniedProductInfo++;
            //} while (predictions.Any(a => (Math.Round(Convert.ToDecimal(
            //    Math.Truncate(a.Score * 1000_000_000) / 1000_000_000), 8) < 0.7m)) || combiniedProductInfo != MAX_ROWS);

            //return predictions;
        }
    }
}
