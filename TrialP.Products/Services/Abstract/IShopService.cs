using TrialP.Products.Models.Api.Shop;

namespace TrialP.Products.Services.Abstract
{
    public interface IShopService
    {
        public Task<ShopApiInfo> GetShopInfoFromApi(int id);
    }
}
