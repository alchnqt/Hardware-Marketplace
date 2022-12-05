using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Net;

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

        public IActionResult GetProductsBySubSubCategory(string subSubCategory, int page = 1)
        {
            string url = $"https://catalog.onliner.by/sdapi/catalog.api/search/{subSubCategory}";
            if(page > 1)
            {
                url += $"?page={page}";
            }
            return Content(GetProccess(url), "application/json");
        }

        public IActionResult GetProductByKey(string key)
        {
            //https://catalog.onliner.by/sdapi/catalog.api/products/gvn3050eagleoc8g?include=schema
            return Content(GetProccess($"https://catalog.onliner.by/sdapi/catalog.api/products/{key}?include=schema"), "application/json");
        }

        public IActionResult GetProductShopsByKey(string key)
        {
            return Content(GetProccess($"https://shop.api.onliner.by/products/{key}/positions"), "application/json");
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
