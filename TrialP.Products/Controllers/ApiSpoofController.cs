using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.Linq;
using System.Net;
using System.Security.Permissions;
using System.Security.Policy;
using System.Text.Json;
using TrialP.Products.Models;
using TrialP.Products.Models.Api;

namespace TrialP.Products.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ApiSpoofController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private const string catalogApiUrl = "https://catalog.onliner.by/sdapi/catalog.ap";
        private const string shopApiUrl1 = "https://shop.api.onliner.by/shops/3016";
        private const string reviewApiUrl = "https://review.api.onliner.by/catalog/shops/3016/reviews";

        public ApiSpoofController(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        public IActionResult UpdateProductsByGategory(string category)
        {
            return NoContent();
        }

        public SearchProduct GetProductsBySubSubCategory(string subSubCategory, int page = 1)
        {
            string url = $"https://catalog.onliner.by/sdapi/catalog.api/search/{subSubCategory}";
            if (page > 1)
            {
                url += $"?page={page}";
            }
            string result = GetProccess(url);

            var serializeOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = true
            };

            SearchProduct searchProduct = JsonSerializer.Deserialize<SearchProduct>(result, serializeOptions);

            using (var context = new TrialPProductsContext())
            {

                var missingProducts = searchProduct.Products.Where(db => !context.Products.Any(search => db.ApiId == search.ApiId)).Select(s =>
                {
                    s.PriceMax = decimal.Parse(s.Prices.PriceMax.Amount, System.Globalization.CultureInfo.InvariantCulture);
                    s.PriceMin = decimal.Parse(s.Prices.PriceMin.Amount, System.Globalization.CultureInfo.InvariantCulture);
                    s.ImageHeader = s.Images.Header;
                    s.Offers = s.Prices.ApiOffers.Count;
                    s.SubSubCategoryId = context.SubSubCategories.Where(w => w.ApiName == subSubCategory).FirstOrDefault()?.Id;
                    return s;
                });
                context.Products.AddRange(missingProducts);
                context.SaveChanges();

                var productsFromDb = context.Products
                    .Where(w => w.SubSubCategory.ApiName == subSubCategory).Skip(30 * (page - 1)).Take(30).ToList();

                searchProduct.Products = productsFromDb;

                return searchProduct;
            }
        }

        public IActionResult GetProductByKey(string key)
        {
            //https://catalog.onliner.by/sdapi/catalog.api/products/gvn3050eagleoc8g?include=schema ignore



            string url = $"https://catalog.onliner.by/sdapi/catalog.api/products/{key}?include=schema";



            return Content(GetProccess(url), "application/json");
        }

        public ProductShops GetProductShopsByKey(string key)
        {
            string url = $"https://shop.api.onliner.by/products/{key}/positions";
            string result = GetProccess(url);

            var serializeOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = true
            };
            ProductShops productShops = JsonSerializer.Deserialize<ProductShops>(result, serializeOptions);

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
                context.ProductShops.AddRange(missingShops);
                context.SaveChanges();

                var missingPosistionsPrimaries = productShops.Positions.Primary.Where(search => !context.PositionsPrimaries.Any(db => db.ApiId == search.ApiId))
                    .Select(s =>
                    {
                        s.ProductId = context.Products.Where(w => w.Key == key).FirstOrDefault()?.IdDb;
                        s.ShopId = context.ProductShops.Where(w => w.ApiId == s.ShopIdApi).FirstOrDefault()?.Id;
                        s.Amount = decimal.Parse(s.PositionPrice.Amount, System.Globalization.CultureInfo.InvariantCulture);
                        s.Currency = s.PositionPrice.Currency;
                        return s;
                    }).ToList();
                context.PositionsPrimaries.AddRange(missingPosistionsPrimaries);
                context.SaveChanges();

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

        private string GetProccess(string url)
        {
            WebRequest request = WebRequest.Create(url);
            request.Credentials = CredentialCache.DefaultCredentials;
            HttpWebResponse response = (HttpWebResponse)request.GetResponse();
            Stream dataStream = response.GetResponseStream();
            StreamReader reader = new StreamReader(dataStream);
            string responseFromServer = reader.ReadToEnd();
            return responseFromServer;
        }
    }
}
