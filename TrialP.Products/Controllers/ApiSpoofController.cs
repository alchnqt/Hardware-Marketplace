using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.Linq;
using System.Net;
using System.Security.Permissions;
using System.Security.Policy;
using System.Text.Json;
using TrialP.Products.Data.Request;
using TrialP.Products.Models;
using TrialP.Products.Models.Api;
using TrialP.Products.Models.Api.Shop;
using TrialP.Products.Services.Abstract;

namespace TrialP.Products.Controllers
{
    [EnableCors("CorsPolicy")]
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ApiSpoofController : ControllerBase
    {
        private readonly IProductService _productService;
        private readonly IShopService _shopService;

        public ApiSpoofController(IProductService productService, IShopService shopService)
        {
            _productService = productService;
            _shopService = shopService;
        }

        public async Task<SearchProduct> GetProductsBySubSubCategory(string subSubCategory, int page = 1)
        {
            var result = await _productService.GetProductsFromApi(subSubCategory, page);
            return result;
        }

        public IActionResult GetAllOrders()
        {
            using(var context = new TrialPProductsContext())
            {
                var orders = context.Orders
                    .Include(pp => pp.PositionsPrimary)
                    .Include(pp => pp.PositionsPrimary.Product)
                    .Where(w => (w.IsCompleted ?? false))
                    .GroupBy(o => o.UserId)
                    .Select(grp => new
                {
                    UserId = grp.Key,
                    Orders = grp.ToList().Select(s => new
                    {
                        Name = s.PositionsPrimary.Product.Name,
                        Amount = s.PositionsPrimary.Amount,
                        OrderDate = s.OrderDate
                    })
                }).ToList();
                return Ok(orders);
            }
        }

        [HttpPost("{id}")]
        public IActionResult CompleteOrders(Guid id)
        {
            using (var context = new TrialPProductsContext())
            {
                var updatedOrders = context.Orders.Where(o => o.UserId == id).ExecuteUpdate(s => s.SetProperty(b => b.IsCompleted, true));
                return Ok(updatedOrders);
            }
        }

        [HttpPost]
        public IActionResult CompleteAllOrders()
        {
            using (var context = new TrialPProductsContext())
            {
                var updatedOrders = context.Orders.ExecuteUpdate(s => s.SetProperty(b => b.IsCompleted, true));
                return Ok(updatedOrders);
            }
        }

        [Authorize]
        [HttpGet("{id}")]
        public IActionResult GetUsersOrderById(Guid id, bool isCompleted = false)
        {
            using (var context = new TrialPProductsContext())
            {
                var orders = (from order in

                    context.Orders.Include(pp => pp.PositionsPrimary).
                    Include(pr => pr.PositionsPrimary.Product).
                    Include(sh => sh.PositionsPrimary.Shop)
                              where order.UserId == id && order.IsCompleted == isCompleted
                              group order by order.Key into g
                              select new
                              {
                                  Key = g.Key.Value,
                                  Amount = g.Sum(x=>x.PositionsPrimary.Amount).ToString(),
                                  Count = g.Count(),
                                  PositionsPrimary = (from pp in g group pp by pp.PositionsPrimaryId into gpp select new
                                  {
                                      Count = gpp.Count(),
                                      PositionsPrimaryValue = 
                                      (from realproduct in gpp select new 
                                      { 
                                          realproduct.PositionsPrimary, 
                                          realproduct.PositionsPrimary.Product 
                                      }).FirstOrDefault()
                                  })
                              }).ToList();

                return Ok(new { orders = orders });
            }
        }

        public async Task<Product> GetProductByKey(string key)
        {
            var res = await _productService.GetProductByKeyFromApi(key);
            return res;
        }

        [HttpGet]
        public async Task<ReviewsDto> GetProductReviewsByKey(string key, bool isSelf, int page = 1)
        {
            var result = await _productService.GetProductReviewByIdFromApi(key, isSelf, page);
            return result;
        }

        [HttpPost]
        public async Task<IActionResult> CreateProductReview(CreateReviewDto createReviewDto)
        {
            using (var context = new TrialPProductsContext())
            {
                var review = new Review()
                {
                    UserId = createReviewDto.UserId,
                    Author = JsonDocument.Parse(createReviewDto.Author),
                    Text = createReviewDto.Text,
                    Cons = createReviewDto.Cons,
                    Pros = createReviewDto.Pros,
                    Summary = createReviewDto.Summary,
                    Rating = createReviewDto.Rating,
                    ApiProductId= createReviewDto.ApiProductId,
                    ProductId = createReviewDto.ProductId,
                    CreatedAt = DateTime.Now
                };
                await context.Reviews.AddAsync(review);
                await context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetProductShopsByKey), new { id = review.ProductId}, review);
            }
        }

        public async Task<IActionResult> GetProductShopsByKey(string key)
        {
            var result = await _productService.GetProductShopsByKeyFromApi(key);
            if(result == null)
            {
                return BadRequest(new { message = "Нет в наличии" });
            }
            return Ok(result);
        }

        public async Task<ShopApiInfo> GetShopById(int id)
        {
            var result = await _shopService.GetShopInfoFromApi(id);
            return result;
        }
    }
}
