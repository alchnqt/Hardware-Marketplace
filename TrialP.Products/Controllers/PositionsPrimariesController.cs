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
    public class PositionsPrimariesController : ControllerBase
    {
        private readonly TrialPProductsContext _context;

        public PositionsPrimariesController(TrialPProductsContext context)
        {
            _context = context;
        }

        // GET: api/PositionsPrimaries
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PositionsPrimary>>> GetPositionsPrimaries()
        {
          if (_context.PositionsPrimaries == null)
          {
              return NotFound();
          }
            return await _context.PositionsPrimaries.ToListAsync();
        }

        // GET: api/PositionsPrimaries/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PositionsPrimary>> GetPositionsPrimary(Guid id)
        {
          if (_context.PositionsPrimaries == null)
          {
              return NotFound();
          }
            var positionsPrimary = await _context.PositionsPrimaries.FindAsync(id);

            if (positionsPrimary == null)
            {
                return NotFound();
            }

            return positionsPrimary;
        }

        // PUT: api/PositionsPrimaries/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPositionsPrimary(Guid id, PositionsPrimary positionsPrimary)
        {
            if (id != positionsPrimary.IdDb)
            {
                return BadRequest();
            }

            _context.Entry(positionsPrimary).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PositionsPrimaryExists(id))
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

        // POST: api/PositionsPrimaries
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PositionsPrimary>> PostPositionsPrimary(PositionsPrimary positionsPrimary)
        {
          if (_context.PositionsPrimaries == null)
          {
              return Problem("Entity set 'TrialPProductsContext.PositionsPrimaries'  is null.");
          }
            _context.PositionsPrimaries.Add(positionsPrimary);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPositionsPrimary", new { id = positionsPrimary.IdDb }, positionsPrimary);
        }

        // DELETE: api/PositionsPrimaries/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePositionsPrimary(Guid id)
        {
            if (_context.PositionsPrimaries == null)
            {
                return NotFound();
            }
            var positionsPrimary = await _context.PositionsPrimaries.FindAsync(id);
            if (positionsPrimary == null)
            {
                return NotFound();
            }

            _context.PositionsPrimaries.Remove(positionsPrimary);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PositionsPrimaryExists(Guid id)
        {
            return (_context.PositionsPrimaries?.Any(e => e.IdDb == id)).GetValueOrDefault();
        }
    }
}
