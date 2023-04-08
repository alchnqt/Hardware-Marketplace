using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Drawing.Printing;
using System.Linq.Expressions;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Unicode;
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
            string url = $"{_apiConfiguration.CatalogApiUrl}/products/{key}?include=schema";
            var res = await _apiService.GetProccessStreamAsync(url);
            var serializeOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = true
            };
            Product product = await JsonSerializer.DeserializeAsync<Product>(res, serializeOptions);

            using (var context = new TrialPProductsContext())
            {
                var searchProduct = context.Products.Include(r => r.Reviews).Where(x => x.Key == key).FirstOrDefault();
                if (searchProduct == null)
                {
                    return product;
                }
                var requestCount = product?.AggregatedReviews.TotalCount ?? 0;
                var requestRating = (product?.AggregatedReviews.TotalRating ?? 0) * requestCount;
                searchProduct.AggregatedReviews = new AggregatedReviews()
                {
                    ExternalCount = requestCount,
                    ExternalRating = product?.AggregatedReviews.TotalRating ?? 0,

                    InternalCount = searchProduct.Reviews.Where(x => x.UserId != null).Count(),
                    InternalRating = searchProduct.Reviews.Where(x => x.UserId != null).Select(s => s.Rating).Sum() ?? 0,

                    TotalCount = requestCount + searchProduct.Reviews.Where(x => x.UserId != null).Count(),
                    TotalRating = (requestRating + searchProduct.Reviews.Select(s => s.Rating).Sum() ?? 0) / ((requestCount + searchProduct.Reviews.Count()) == 0 ? 1 : (requestCount + searchProduct.Reviews.Count())),
                    Url = product?.AggregatedReviews.Url ?? "",
                    HtmlUrl = product?.AggregatedReviews.HtmlUrl
                };
                return searchProduct;
            }
        }

        public async Task<ReviewsDto> GetProductReviewByIdFromApi(string key, bool isSelf, int page = 1)
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
                WriteIndented = true,
                Encoder = JavaScriptEncoder.Create(UnicodeRanges.BasicLatin, UnicodeRanges.Cyrillic)
            };
            ReviewsDto reviewsDto = await JsonSerializer.DeserializeAsync<ReviewsDto>(result, serializeOptions);

            using (var context = new TrialPProductsContext())
            {
                var missingReviews = reviewsDto.Reviews.Where(db => !context.Reviews.Any(search => db.ApiId == search.ApiId))
                    .Select(s =>
                    {
                        Guid? prId = context.Products.Where(w => w.Key == key).Select(s => s.Id).FirstOrDefault();
                        s.ProductId = prId == Guid.Empty ? null : prId;
                        return s;
                    });
                await context.Reviews.AddRangeAsync(missingReviews);
                await context.SaveChangesAsync();

                var productsFromDb = context.Reviews.Include(pr => pr.Product).AsQueryable();
                if (isSelf)
                {
                    productsFromDb = productsFromDb.Where(x => x.UserId != null && x.Product.Key == key);
                    reviewsDto.Total = context.Reviews.Count(x => x.UserId != null && x.Product.Key == key);

                    reviewsDto.Page.Current = productsFromDb.Count() == 0 ? 1 : page;
                    reviewsDto.Page.Items = productsFromDb.Count();
                    reviewsDto.Page.Limit = 10;

                    reviewsDto.Page.Last = (reviewsDto.Page.Items + reviewsDto.Page.Limit - 1) / reviewsDto.Page.Limit;
                }
                else
                {
                    productsFromDb = productsFromDb.Where(x => x.UserId == null && x.Product.Key == key);
                }

                productsFromDb = productsFromDb
                    .OrderByDescending(odb => odb.CreatedAt)
                    .Skip(10 * (page - 1))
                    .Take(10);

                reviewsDto.Reviews = await productsFromDb.ToListAsync();

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

                var missingProducts = searchProduct.Products.Where(db =>
                    !context.Products.Include(r => r.Reviews).Any(search => db.Key == search.Key)).Select(s =>
                {
                    s.PriceMax = decimal.Parse(s.Prices.PriceMax.Amount, System.Globalization.CultureInfo.InvariantCulture);
                    s.PriceMin = decimal.Parse(s.Prices.PriceMin.Amount, System.Globalization.CultureInfo.InvariantCulture);
                    s.ImageHeader = s.Images.Header;
                    s.Offers = s.Prices.ApiOffers.Count;
                    s.SubSubCategoryId = (context.SubSubCategories.Where(w => w.ApiName == subSubCategory).FirstOrDefault())?.Id;
                    return s;
                });
                await context.Products.AddRangeAsync(missingProducts);
                await context.SaveChangesAsync();

                //.Skip(30 * (page - 1)).Take(30)
                var requestApiProductKeys = searchProduct.Products.Select(s => s.Key).ToList();
                var productsFromDb = await context.Products
                    .Where(w => w.SubSubCategory.ApiName == subSubCategory
                    && requestApiProductKeys.Contains(w.Key)).ToListAsync();

                productsFromDb = productsFromDb.Select(s =>
                {
                    var requestProduct = searchProduct.Products.Where(w => w.Key == s.Key).FirstOrDefault();
                    var requestCount = requestProduct?.AggregatedReviews.TotalCount ?? 0;
                    var requestRating = (requestProduct?.AggregatedReviews.TotalRating ?? 0) * requestCount;
                    s.AggregatedReviews = new AggregatedReviews()
                    {
                        ExternalCount = requestCount,
                        ExternalRating = requestProduct?.AggregatedReviews.TotalRating ?? 0,

                        InternalCount = s.Reviews.Count(),
                        InternalRating = s.Reviews.Select(s => s.Rating).Sum() ?? 0,

                        TotalCount = requestCount + s.Reviews.Count(),
                        TotalRating = (requestRating + s.Reviews.Select(s => s.Rating).Sum() ?? 0) / ((requestCount + s.Reviews.Count()) == 0 ? 1 : (requestCount + s.Reviews.Count())),
                        Url = requestProduct?.AggregatedReviews.Url ?? "",
                        HtmlUrl = requestProduct?.AggregatedReviews.HtmlUrl
                    };
                    return s;
                }).ToList();

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


                productShops.Shops = context.PositionsPrimaries.Include(pr => pr.Product).Include(sh => sh.Shop).Where(w => w.Product.Key == key).Select(p => p.Shop)
                .ToDictionary(k => k.ApiId.Value, v => v);
            }

            return productShops;
        }
    }
}
