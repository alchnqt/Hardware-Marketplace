using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using TrialP.Products.Data;
using TrialP.Products.Models;
using TrialP.Products.Models.Api;
using System.Text.Json;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using TrialP.Products.Data.Response;
using TrialP.Products.Data.Request;

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

        [HttpPost]
        public async Task<IActionResult> AddCategory(SubSubCategoryDto subSubCategoryDto) 
        {
            try
            {
                using (var context = new TrialPProductsContext())
                {
                    var subCategory = context.SubCategories.Where(w => w.Name.ToLower() == subSubCategoryDto.SubCategoryName.ToLower()).FirstOrDefault();
                    SubSubCategory subSubCategory = new() { Name= subSubCategoryDto.Name, ApiName = subSubCategoryDto.ApiName, SubCategoryId = subCategory?.Id };
                    await context.SubSubCategories.AddAsync(subSubCategory);
                    await context.SaveChangesAsync();
                }
                return Ok();
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        [HttpPut]
        public async Task<IActionResult> UpdateCategory(SubSubCategoryDto subSubCategoryDto)
        {
            try
            {
                using (var context = new TrialPProductsContext())
                {
                    var existSubSubCategory = context.SubSubCategories.Where(w => w.Id.ToString() == subSubCategoryDto.Id).FirstOrDefault();
                    if(existSubSubCategory != null)
                    {
                        existSubSubCategory.Name = subSubCategoryDto.Name;
                        existSubSubCategory.ApiName = subSubCategoryDto.ApiName;
                        await context.SaveChangesAsync();
                    }
                }
                return Ok();
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }


        [HttpDelete]
        public async Task<IActionResult> RemoveCategory(RemoveByIdDto dto)
        {
            try
            {
                using (var context = new TrialPProductsContext())
                {
                    var existSubSubCategory = context.SubSubCategories.Where(w => w.Id.ToString() == dto.Id).FirstOrDefault();
                    if(existSubSubCategory != null)
                    {
                        context.SubSubCategories.Remove(existSubSubCategory);
                        await context.SaveChangesAsync();
                    }
                }
                return NoContent();
            }
            catch (Exception)
            {
                return BadRequest();
            }
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
                            Id = s.Id.ToString(),
                            SubsName = s.Name,
                            ImageUrl = s.Image,
                            Subssubs = context.SubSubCategories.Select(s => new CategoryDto.MainDto.SubDto.SubsubDto()
                            {
                                Id = s.Id.ToString(),
                                Name = s.Name,
                                ApiCategory = s.ApiName
                            }).ToList()
                        }).ToList(),
                    }).ToList();

                var convertedDto = new CategoryDto();

                convertedDto.Main = context.Categories.Include(s => s.SubCategories)
                    .ThenInclude(ss => ss.SubSubCategories)
                    .Select(s => new CategoryDto.MainDto()
                    {
                        Id = s.Id.ToString(),
                        MainName = s.Name,
                        Subs = s.SubCategories.Select(sb => new CategoryDto.MainDto.SubDto() 
                        {
                            Id = sb.Id.ToString(),
                            ImageUrl = sb.Image, 
                            SubsName = sb.Name,
                            Subssubs = sb.SubSubCategories.Select(ssb => new CategoryDto.MainDto.SubDto.SubsubDto() { Id = ssb.Id.ToString(), Name = ssb.Name, ApiCategory= ssb.ApiName }).ToList()
                        }).ToList(),
                    })
                    .ToList();

                return convertedDto;
            }
        }
    }
}
