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

        public IActionResult GetAllOrders()
        {
            using(var context = new TrialPProductsContext())
            {
                var groupedOrders = (from order in context.Orders
                                     group order by order.UserId into orderg
                                     select new
                                     {
                                         Count = orderg.Count(),
                                         UserId = orderg.Key,
                                         Orders = (from o in orderg group o by o.Key into og select og.FirstOrDefault())
                                     }).ToList();
                return Ok(new { userOrders = groupedOrders });
            }
        }

        [HttpPost("{id}")]
        public IActionResult CompleteOrders(Guid id)
        {
            using (var context = new TrialPProductsContext())
            {
                var updatedOrders = context.Orders.Where(o => o.UserId == id).ExecuteUpdate(s => s.SetProperty(b => b.IsCompleted, true));
                return Ok(updatedOrders);
            }
        }

        [HttpGet("{id}")]
        public IActionResult GetUsersOrderById(Guid id, bool isCompleted = false)
        {
            using (var context = new TrialPProductsContext())
            {
                var orders = (from order in

                    context.Orders.Include(pp => pp.PositionsPrimary).
                    Include(pr => pr.PositionsPrimary.Product).
                    Include(sh => sh.PositionsPrimary.Shop)
                              where order.UserId == id && order.IsCompleted == isCompleted
                              group order by order.Key into g
                              select new
                              {
                                  Key = g.Key.Value,
                                  Amount = g.Sum(x=>x.PositionsPrimary.Amount).ToString(),
                                  Count = g.Count(),
                                  PositionsPrimary = (from pp in g group pp by pp.PositionsPrimaryId into gpp select new
                                  {
                                      Count = gpp.Count(),
                                      PositionsPrimaryValue = 
                                      (from realproduct in gpp select new 
                                      { 
                                          realproduct.PositionsPrimary, 
                                          realproduct.PositionsPrimary.Product 
                                      }).FirstOrDefault()
                                  })
                              }).ToList();

                return Ok(new { orders = orders });
            }
        }

        public IActionResult GetProductByKey(string key)
        {
            //https://catalog.onliner.by/sdapi/catalog.api/products/gvn3050eagleoc8g?include=schema ignore
            using (var context = new TrialPProductsContext())
            {
                var searchProduct = context.Products.Where(x => x.Key == key).FirstOrDefault();
                if (searchProduct != null)
                {
                    return Ok(searchProduct);
                }
            }

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
