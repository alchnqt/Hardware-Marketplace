using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Thinktecture;
using TrialP.Products.Models;
using TrialP.Products.Models.Api.Internal;
using TrialP.Products.Services.Abstract;

namespace TrialP.Products.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly TrialPProductsContext _context;
        private readonly IExternalApiService _externalApiService;

        public ProductsController(TrialPProductsContext context, IExternalApiService externalApiService)
        {
            _context = context;
            _externalApiService = externalApiService;
        }

        [HttpGet]
        public async Task<IActionResult> Top3CoProductsByProductId(Guid productId)
        {
            var productIndex = _context.Products
                 .Select(x => new
                 {
                     x.Id,
                     RowNumber = EF.Functions.RowNumber(EF.Functions.OrderBy(x.Id))
                 })
                .AsSubQuery()
                .Where(x => x.Id == productId)
                .FirstOrDefault()?.RowNumber;

            var result = await _externalApiService.GetProccessAsync($"http://localhost:5173/api/ml/gettop3recommendations?id={productIndex}");
            var serializeOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = true
            };
            var predictions = JsonSerializer.Deserialize<List<ProductPrediction>>(result, serializeOptions);
            var neededProducts = _context.Products.Select(s => new
            {
                Product = s,
                RowNumber = EF.Functions.RowNumber(EF.Functions.OrderBy(s.Id))
            }).AsSubQuery().Where(w => predictions.Any(pr => pr.ProductId == w.RowNumber)).ToList();
            return Ok(neededProducts);
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            if (_context.Products == null)
            {
                return NotFound();
            }
            return await _context.Products.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(Guid id)
        {
            if (_context.Products == null)
            {
                return NotFound();
            }
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            return product;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduct(Product product)
        {
            var existingP = _context.Products.Where(w => w.Key == product.Key).FirstOrDefault();
            existingP.FullName = product.FullName;
            existingP.Description = product.Description;
            existingP.ExtendedName = product.ExtendedName;
            existingP.Name = product.Name;
            existingP.PriceMax = product.PriceMax;
            existingP.PriceMin = product.PriceMin;

            _context.Entry(existingP).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (existingP == null)
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<Product>> PostProduct(Product product)
        {
            if (_context.Products == null)
            {
                return Problem("Entity set 'TrialPProductsContext.Products'  is null.");
            }
            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProduct", new { id = product.Id }, product);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(string id)
        {
            if (_context.Products == null)
            {
                return NotFound();
            }
            var product = _context.Products.Where(w => w.Key == id).FirstOrDefault();
            if (product == null)
            {
                return NotFound();
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProductExists(Guid id)
        {
            return (_context.Products?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
