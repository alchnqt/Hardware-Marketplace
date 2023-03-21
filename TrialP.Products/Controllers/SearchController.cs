using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections;
using TrialP.Products.Models;
using TrialP.Products.Services.Abstract;
using TrialP.Products.Services.Domain;

namespace TrialP.Products.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SearchController : ControllerBase
    {
        private readonly ISearchService _searchService;

        public SearchController(ISearchService searchService)
        {
            _searchService = searchService;
        }

        [HttpGet]
        public async Task<IEnumerable<Product>> DefaultSearch(string name) => await _searchService.Search(name);
    }
}
