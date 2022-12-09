using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrialP.Products.Models;

namespace TrialP.Products.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductShopsController : ControllerBase
    {
        private readonly TrialPProductsContext _context;

        public ProductShopsController(TrialPProductsContext context)
        {
            _context = context;
        }

        // GET: api/ProductShops
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductShop>>> GetProductShops()
        {
          if (_context.ProductShops == null)
          {
              return NotFound();
          }
            return await _context.ProductShops.ToListAsync();
        }

        // GET: api/ProductShops/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductShop>> GetProductShop(Guid id)
        {
          if (_context.ProductShops == null)
          {
              return NotFound();
          }
            var productShop = await _context.ProductShops.FindAsync(id);

            if (productShop == null)
            {
                return NotFound();
            }

            return productShop;
        }

        // PUT: api/ProductShops/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProductShop(Guid id, ProductShop productShop)
        {
            if (id != productShop.Id)
            {
                return BadRequest();
            }

            _context.Entry(productShop).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductShopExists(id))
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

        // POST: api/ProductShops
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ProductShop>> PostProductShop(ProductShop productShop)
        {
          if (_context.ProductShops == null)
          {
              return Problem("Entity set 'TrialPProductsContext.ProductShops'  is null.");
          }
            _context.ProductShops.Add(productShop);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProductShop", new { id = productShop.Id }, productShop);
        }

        // DELETE: api/ProductShops/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProductShop(Guid id)
        {
            if (_context.ProductShops == null)
            {
                return NotFound();
            }
            var productShop = await _context.ProductShops.FindAsync(id);
            if (productShop == null)
            {
                return NotFound();
            }

            _context.ProductShops.Remove(productShop);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProductShopExists(Guid id)
        {
            return (_context.ProductShops?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
