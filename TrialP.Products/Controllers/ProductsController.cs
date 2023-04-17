using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Thinktecture;
using TrialP.Products.Data.Database;
using TrialP.Products.Models;
using TrialP.Products.Models.Api.Internal;
using TrialP.Products.Services.Abstract;

namespace TrialP.Products.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IExternalApiService _externalApiService;

        public ProductsController(IExternalApiService externalApiService)
        {
            _externalApiService = externalApiService;
        }

        [HttpGet]
        public async Task<IActionResult> GetTop3Sold()
        {
            using(var context = new TrialPProductsContext())
            {
                var top3 = await context.Orders
                    .Include(pp => pp.PositionsPrimary)
                    .Include(p => p.PositionsPrimary.Product).GroupBy(group => group.Key).Select(p => new
                    {
                        p.Key,
                        Product = new
                        {
                            ApiKey = p.FirstOrDefault().PositionsPrimary.Product.Key,
                            Name = p.FirstOrDefault().PositionsPrimary.Product.Name,
                            Microdescription = p.FirstOrDefault().PositionsPrimary.Product.Description,
                            Amount = p.FirstOrDefault().PositionsPrimary.Amount,
                            Currency = p.FirstOrDefault().PositionsPrimary.Currency,
                            Images = p.FirstOrDefault().PositionsPrimary.Product.Images
                        }
                    }).Take(3).ToListAsync();
                return Ok(top3);
            }
        }

        [HttpGet("{key}")]
        public async Task<IActionResult> Top3CoProductsByProductApiKey(string key)
        {
            using(var context = new TrialPProductsContext()) 
            {
                var productIndex = context.RowNumberProducts.Where(w => w.Key == key)
                    .FirstOrDefault();
                var result = await _externalApiService.GetProccessAsync($"http://localhost:5173/api/ml/gettop3recommendations?id={productIndex.RowNum}");
                var serializeOptions = new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                    WriteIndented = true
                };
                var predictions = JsonSerializer.Deserialize<List<ProductPrediction>>(result, serializeOptions);
                var products = new List<Product>();
                foreach (var item in predictions)
                {
                    var neededProduct = context.RowNumberProducts
                    .Join(context.Products, p => p.Key, n => n.Key,
                    (p, n) => new { RowNumProduct = p, Product = n })
                    .Where(w => w.RowNumProduct.RowNum == item.ProductId)
                    .Select(s => s.Product)
                    .FirstOrDefault();
                    products.Add(neededProduct);
                }
                
                return Ok(products);
            }
        }
    }
}
