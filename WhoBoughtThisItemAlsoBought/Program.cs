using Microsoft.ML;
using Microsoft.ML.Data;
using Microsoft.ML.Trainers;
using System.Collections.Concurrent;

namespace WhoBoughtThisItemAlsoBought
{
    public class Program
    {
        private static string BaseDataSetRelativePath = @"../../../Data";
        private static string TrainingDataRelativePath = $"{BaseDataSetRelativePath}/Amazon0302.txt";
        private static string TrainingDataLocation = GetAbsolutePath(TrainingDataRelativePath);

        private static string BaseModelRelativePath = @"../../../Model";
        private static string ModelRelativePath = $"{BaseModelRelativePath}/model.zip";
        private static string ModelPath = GetAbsolutePath(ModelRelativePath);

        private const int MAX_ROWS = 262111;

        static async Task Main(string[] args)
        {
            MLContext mlContext = new MLContext();

            //var traindata = mlContext.Data.LoadFromTextFile(path: TrainingDataLocation,
            //columns: new[]
            //          {
            //              new TextLoader.Column("Label", DataKind.Single, 0),

            //              new TextLoader.Column(name:nameof(ProductInfo.ProductID), dataKind:DataKind.UInt32,
            //                 source: new [] { new TextLoader.Range(0) }, keyCount: new KeyCount(MAX_ROWS)),

            //              new TextLoader.Column(name:nameof(ProductInfo.CombinedProductID), dataKind:DataKind.UInt32,
            //                source: new [] { new TextLoader.Range(1) }, keyCount: new KeyCount(MAX_ROWS))
            //          },
            //hasHeader: true,
            //separatorChar: '\t');

            //MatrixFactorizationTrainer.Options options = new MatrixFactorizationTrainer.Options();
            //options.MatrixColumnIndexColumnName = nameof(ProductInfo.ProductID);
            //options.MatrixRowIndexColumnName = nameof(ProductInfo.CombinedProductID);
            //options.LabelColumnName = "Label";
            //options.LossFunction = MatrixFactorizationTrainer.LossFunctionType.SquareLossOneClass;
            //options.Alpha = 0.01;
            //options.Lambda = 0.025;
            //var est = mlContext.Recommendation().Trainers.MatrixFactorization(options);

            //ITransformer model = est.Fit(traindata);
            //mlContext.Model.Save(model, traindata.Schema, "model.zip");

            DataViewSchema modelSchema;
            ITransformer trainedModel = mlContext.Model.Load("model.zip", out modelSchema);
            var predictionengine = mlContext.Model.CreatePredictionEngine<ProductInfo, ProductPrediction>(trainedModel);
            List<(uint, float)> predictions = new();
            float score = 0.0f;
            uint combiniedProductInfo = 1;
            try
            {
                do
                {
                    var prediction = predictionengine.Predict(
                    new ProductInfo()
                    {
                        ProductID = 10,
                        CombinedProductID = combiniedProductInfo
                    });
                    if(!float.IsNaN(prediction.Score))
                    {
                        score = prediction.Score;
                        predictions.Add((combiniedProductInfo, score));
                        if (predictions.Count() == 4 && combiniedProductInfo != MAX_ROWS)
                        {
                            predictions.RemoveAll(x => (decimal)x.Item2 == (decimal)predictions.Min(x => x.Item2));
                        }
                    }
                    combiniedProductInfo++;
                } while (predictions.Any(a => (Math.Round(Convert.ToDecimal(
                    Math.Truncate(a.Item2 * 1000_000_000) / 1000_000_000), 8) < 0.7m)) || combiniedProductInfo != MAX_ROWS);
            }
            catch (System.OverflowException e)
            {

                Console.WriteLine(e.Data);
            }
            

            foreach (var item in predictions)
            {
                Console.WriteLine($"\n For ProductID = 3 the predicted score is {item.Item2}, needed combined id: {item.Item1}");
            }
            Console.WriteLine("=============== End of process, hit any key to finish ===============");
            Console.ReadKey();
        }

        public static string GetAbsolutePath(string relativeDatasetPath)
        {
            FileInfo _dataRoot = new FileInfo(typeof(Program).Assembly.Location);
            string assemblyFolderPath = _dataRoot.Directory.FullName;
            string fullPath = Path.Combine(assemblyFolderPath, relativeDatasetPath);
            return fullPath;
        }

    }
}