namespace TrialP.Products.Services.Abstract
{
    public interface IExternalApiService
    {
        public Task<string> GetProccessAsync(string url);

        public Task<Stream> GetProccessStreamAsync(string url);
    }
}
