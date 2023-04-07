using TrialP.Products.Models;
using TrialP.Products.Models.Api;

namespace TrialP.Products.Services.Abstract
{
    public interface IProductService
    {
        public Task<SearchProduct> GetProductsFromApi(string subSubCategory, int page = 1);

        public Task<ReviewsDto> GetProductReviewByIdFromApi(string key, bool isSelf, int page = 1);

        public Task<ProductShops> GetProductShopsByKeyFromApi(string key);

        public Task<Product> GetProductByKeyFromApi(string key);
    }
}
