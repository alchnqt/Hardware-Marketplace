using TrialP.Products.Models;

namespace TrialP.Products.Services.Abstract
{
    public interface ISearchService
    {
        Task<IEnumerable<Product>> Search(string name);
    }
}
