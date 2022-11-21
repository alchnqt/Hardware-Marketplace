using Microsoft.AspNetCore.Mvc;
using TrialP.Products.Models;
using Microsoft.AspNetCore.Hosting;
using Newtonsoft.Json;
using TrialP.Products.Data;

namespace TrialP.Products.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly IWebHostEnvironment _hostingEnvironment;

        public CategoriesController(IWebHostEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
        }

        [HttpGet] 
        public async Task<IActionResult> GetEverything()
        {
            var rootPath = _hostingEnvironment.ContentRootPath;

            var fullPath = Path.Combine(rootPath, "Data/categories.json"); 

            var jsonData = await System.IO.File.ReadAllTextAsync(fullPath); 

            return Content(jsonData, "application/json");
        }
    }
}
