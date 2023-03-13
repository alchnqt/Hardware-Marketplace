using System.Net;
using TrialP.Products.Services.Abstract;

namespace TrialP.Products.Services.Domain
{
    public class ExternalApiService : IExternalApiService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        public ExternalApiService(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }
        public async Task<string> GetProccessAsync(string url)
        {
            var httpClient = _httpClientFactory.CreateClient("externalService");
            var httpResponseMessage = await httpClient.GetAsync(url);
            return await httpResponseMessage.Content.ReadAsStringAsync();
        }

        public async Task<Stream> GetProccessStreamAsync(string url)
        {
            var httpClient = _httpClientFactory.CreateClient("externalService");
            var httpResponseMessage = await httpClient.GetAsync(url);
            return await httpResponseMessage.Content.ReadAsStreamAsync();
        }
    }
}
