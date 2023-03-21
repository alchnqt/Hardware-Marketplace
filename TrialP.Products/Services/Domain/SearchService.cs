using Microsoft.EntityFrameworkCore;
using TrialP.Products.Models;
using TrialP.Products.Services.Abstract;

namespace TrialP.Products.Services.Domain
{
    public class SearchService : ISearchService
    {
        public async Task<IEnumerable<Product>> Search(string name)
        {
            using(var context = new TrialPProductsContext())
            {
                var result = await context.Products.Where(s => s.Name.ToLower().IndexOf(name.ToLower()) > -1).Take(5).ToListAsync();
                return result;
            }
        }
    }
}
