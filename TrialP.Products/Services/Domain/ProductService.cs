using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Text.Json;
using TrialP.Products.Configuration;
using TrialP.Products.Models;
using TrialP.Products.Models.Api;
using TrialP.Products.Services.Abstract;

namespace TrialP.Products.Services.Domain
{
    public class ProductService : IProductService
    {
        private readonly IExternalApiService _apiService;
        private readonly ExternalServiceSettings _apiConfiguration;
        public ProductService(IExternalApiService apiService, IOptionsSnapshot<ExternalServiceSettings> apiConfiguration)
        {
            _apiService = apiService;
            _apiConfiguration = apiConfiguration.Value;
        }

        public async Task<Product> GetProductByKeyFromApi(string key)
        {
            using (var context = new TrialPProductsContext())
            {
                var searchProduct = context.Products.Where(x => x.Key == key).FirstOrDefault();
                if (searchProduct != null)
                {
                    return searchProduct;
                }
            }
            
            string url = $"{_apiConfiguration.CatalogApiUrl}/products/{key}?include=schema";
            var res = await _apiService.GetProccessStreamAsync(url);
            var serializeOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = true
            };
            Product product = await JsonSerializer.DeserializeAsync<Product>(res, serializeOptions);
            return product;
        }

        public async Task<ReviewsDto> GetProductReviewByIdFromApi(string key, int page = 1)
        {
            string url = $"{_apiConfiguration.CatalogApiUrl}/products/{key}/reviews?order=created_at:desc";

            if (page > 1)
            {
                url += $"&page={page}";
            }

            var result = await _apiService.GetProccessStreamAsync(url);
            var serializeOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = true
            };
            ReviewsDto reviewsDto = await JsonSerializer.DeserializeAsync<ReviewsDto>(result, serializeOptions);

            using (var context = new TrialPProductsContext())
            {
                var missingReviews = reviewsDto.Reviews.Where(db => !context.Reviews.Any(search => db.ApiId == search.ApiId))
                    .Select(s =>
                    {
                        Guid? prId = (from pr in context.Products where s.ApiProductId == pr.Key select pr.Id).FirstOrDefault();
                        s.ProductId = prId == Guid.Empty ? null : prId;
                        return s;
                    });
                await context.Reviews.AddRangeAsync(missingReviews);
                await context.SaveChangesAsync();

                var productsFromDb = await context.Reviews.OrderByDescending(odb => odb.CreatedAt).Skip(10 * (page - 1)).Take(10).ToListAsync();

                reviewsDto.Reviews = productsFromDb;

                return reviewsDto;
            }
        }

        public async Task<SearchProduct> GetProductsFromApi(string subSubCategory, int page = 1)
        {
            string url = $"{_apiConfiguration.CatalogApiUrl}/search/{subSubCategory}";
            if (page > 1)
            {
                url += $"?page={page}";
            }
            var result = await _apiService.GetProccessStreamAsync(url);

            var serializeOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = true
            };

            SearchProduct searchProduct = await JsonSerializer.DeserializeAsync<SearchProduct>(result, serializeOptions);

            using (var context = new TrialPProductsContext())
            {

                var missingProducts = searchProduct.Products.Where(db => !context.Products.Any(search => db.ApiId == search.ApiId)).Select(s =>
                {
                    s.PriceMax = decimal.Parse(s.Prices.PriceMax.Amount, System.Globalization.CultureInfo.InvariantCulture);
                    s.PriceMin = decimal.Parse(s.Prices.PriceMin.Amount, System.Globalization.CultureInfo.InvariantCulture);
                    s.ImageHeader = s.Images.Header;
                    s.Offers = s.Prices.ApiOffers.Count;
                    s.SubSubCategoryId =  (context.SubSubCategories.Where(w => w.ApiName == subSubCategory).FirstOrDefault())?.Id;
                    return s;
                });
                await context.Products.AddRangeAsync(missingProducts);
                await context.SaveChangesAsync();

                var productsFromDb = await context.Products
                    .Where(w => w.SubSubCategory.ApiName == subSubCategory).Skip(30 * (page - 1)).Take(30).ToListAsync();

                searchProduct.Products = productsFromDb;

                return searchProduct;
            }
        }

        public async Task<ProductShops> GetProductShopsByKeyFromApi(string key)
        {
            string url = $"{_apiConfiguration.ShopApiUrl}/products/{key}/positions";
            var result = await _apiService.GetProccessStreamAsync(url);

            var serializeOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = true
            };
            ProductShops productShops = await JsonSerializer.DeserializeAsync<ProductShops>(result, serializeOptions);

            using (var context = new TrialPProductsContext())
            {
                var missingShops = productShops.Shops.Where(search => !context.ProductShops.Any(db => search.Key == db.ApiId))
                   .Select(s => new ProductShop()
                   {
                       ApiId = s.Key,
                       Logo = s.Value.Logo,
                       Title = s.Value.Title,
                       Url = s.Value.Url
                   }).ToList();
                await context.ProductShops.AddRangeAsync(missingShops);
                await context.SaveChangesAsync();

                var missingPosistionsPrimaries = productShops.Positions.Primary.Where(search => !context.PositionsPrimaries.Any(db => db.ApiId == search.ApiId))
                    .Select(s =>
                    {
                        s.ProductId = context.Products.Where(w => w.Key == key).FirstOrDefault()?.Id;
                        s.ShopId = context.ProductShops.Where(w => w.ApiId == s.ShopIdApi).FirstOrDefault()?.Id;
                        s.Amount = decimal.Parse(s.PositionPrice.Amount, System.Globalization.CultureInfo.InvariantCulture);
                        s.Currency = s.PositionPrice.Currency;
                        return s;
                    }).ToList();
                await context.PositionsPrimaries.AddRangeAsync(missingPosistionsPrimaries);
                await context.SaveChangesAsync();

                productShops.Positions.Primary = (from pp
                                      in context.PositionsPrimaries.Include(pr => pr.Product).Include(sh => sh.Shop)
                                                  join shop in context.ProductShops on pp.ShopIdApi equals shop.ApiId
                                                  where pp.Product.Key == key
                                                  select pp).ToList();

                productShops.Shops = (from pp
                                      in context.PositionsPrimaries.Include(pr => pr.Product).Include(sh => sh.Shop)
                                      join shop in context.ProductShops on pp.ShopIdApi equals shop.ApiId
                                      where pp.Product.Key == key
                                      select shop)
                .ToDictionary(k => k.ApiId.Value, v => v);
            }

            return productShops;
        }
    }
}
