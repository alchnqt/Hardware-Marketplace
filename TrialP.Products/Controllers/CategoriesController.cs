using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using TrialP.Products.Data;
using TrialP.Products.Models;
using TrialP.Products.Models.Api;
using System.Text.Json;
using System.Linq;
using Microsoft.EntityFrameworkCore;

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
        public async Task<CategoryDto> GetEverything()
        {
            var rootPath = _hostingEnvironment.ContentRootPath;

            var fullPath = Path.Combine(rootPath, "Data/categories.json");

            var jsonData = await System.IO.File.ReadAllTextAsync(fullPath);

            var serializeOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = true
            };

            CategoryDto categories = JsonSerializer.Deserialize<CategoryDto>(jsonData, serializeOptions);

            using (var context = new TrialPProductsContext())
            {

                var missingCategories = categories.Main.Where(db => !context.Categories.Any(search => db.MainName == search.Name))
                    .Select(s => new Category() { Name = s.MainName }).ToList();
                context.Categories.AddRange(missingCategories);
                context.SaveChanges();


                var missingSubCategories = categories.Main.First().Subs.Where(db => !context.SubCategories.Any(search => db.SubsName == search.Name))
                    .Select(s => new SubCategory()
                    {
                        Name = s.SubsName,
                        Image = s.ImageUrl,
                        CategoryId = context.Categories.Where(w => w.Name == categories.Main.First().MainName).FirstOrDefault()?.Id
                    });
                context.SubCategories.AddRange(missingSubCategories);
                context.SaveChanges();

                List<SubSubCategory> missingSubSubCategories = new();
                foreach (var item in categories.Main.First().Subs)
                {
                    var missingSubSubCategoriesItem = item
                    .Subssubs.Where(db => !context.SubSubCategories.Any(search => db.Name == search.Name))
                    .Select(s => new SubSubCategory()
                    {
                        Name = s.Name,
                        ApiName = s.ApiCategory,
                        SubCategoryId = context.SubCategories.Where(w => w.Name == item.SubsName).FirstOrDefault()?.Id
                    }).ToList();
                    missingSubSubCategories.AddRange(missingSubSubCategoriesItem);
                }
                context.SubSubCategories.AddRange(missingSubSubCategories);
                context.SaveChanges();

                categories.Main = context.Categories.Select(s =>
                    new CategoryDto.MainDto()
                    {
                        MainName = s.Name,
                        Subs = context.SubCategories.Select(s => new CategoryDto.MainDto.SubDto()
                        {
                            SubsName = s.Name,
                            ImageUrl = s.Image,
                            Subssubs = context.SubSubCategories.Select(s => new CategoryDto.MainDto.SubDto.SubsubDto()
                            {
                                Name= s.Name,
                                ApiCategory = s.ApiName
                            }).ToList()
                        }).ToList(),
                    }).ToList();

                var convertedDto = new CategoryDto();

                convertedDto.Main = context.Categories.Include(s => s.SubCategories)
                    .ThenInclude(ss => ss.SubSubCategories)
                    .Select(s => new CategoryDto.MainDto()
                    {
                        MainName = s.Name,
                        Subs = s.SubCategories.Select(sb => new CategoryDto.MainDto.SubDto() 
                        { 
                            ImageUrl= sb.Image, 
                            SubsName = sb.Name,
                            Subssubs = sb.SubSubCategories.Select(ssb => new CategoryDto.MainDto.SubDto.SubsubDto() { Name = ssb.Name, ApiCategory= ssb.ApiName }).ToList()
                        }).ToList(),
                    })
                    .ToList();

                return convertedDto;
            }
        }
    }
}
