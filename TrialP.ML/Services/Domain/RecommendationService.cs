﻿using Microsoft.ML;
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
            do
            {
                var prediction = predictionengine.Predict(
                new ProductInfo()
                {
                    ProductID = 10,
                    CombinedProductID = combiniedProductInfo
                });
                if (!float.IsNaN(prediction.Score))
                {
                    score = prediction.Score;
                    predictions.Add(new ProductRecommendation { ProductId = combiniedProductInfo, Score = score });
                    if (predictions.Count() == 4 && combiniedProductInfo != MAX_ROWS)
                    {
                        predictions.RemoveAll(x => (decimal)x.Score == (decimal)predictions.Min(x => x.Score));
                    }
                }
                combiniedProductInfo++;
            } while (predictions.Any(a => (Math.Round(Convert.ToDecimal(
                Math.Truncate(a.Score * 1000_000_000) / 1000_000_000), 8) < 0.7m)) || combiniedProductInfo != MAX_ROWS);

            return predictions;
        }
    }
}
