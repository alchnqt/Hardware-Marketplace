using Microsoft.Extensions.Options;
using System.Text.Json;
using TrialP.Products.Configuration;
using TrialP.Products.Models.Api.Shop;
using TrialP.Products.Services.Abstract;

namespace TrialP.Products.Services.Domain
{
    public class ShopService : IShopService
    {
        private readonly IExternalApiService _externalApiService;
        private readonly ExternalServiceSettings _apiConfiguration;
        public ShopService(IExternalApiService externalApiService, IOptionsSnapshot<ExternalServiceSettings> apiConfiguration)
        {
            _externalApiService = externalApiService;
            _apiConfiguration = apiConfiguration.Value;
        }

        public async Task<ShopApiInfo> GetShopInfoFromApi(int id)
        {
            string url = $"{_apiConfiguration.ShopApiUrl}/shops/{id}?include=full";
            var result = await _externalApiService.GetProccessStreamAsync(url);
            var serializeOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = true
            };
            ShopApiInfo shop = await JsonSerializer.DeserializeAsync<ShopApiInfo>(result, serializeOptions);
            return shop;
        }
    }
}
