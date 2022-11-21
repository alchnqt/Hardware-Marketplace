using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace TrialP.Products.Controllers
{
    [Route("api/[controller]")]
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
    }
}
