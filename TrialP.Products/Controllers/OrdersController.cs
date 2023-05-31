using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrialP.Products.Models;
using TrialP.Products.Models.Api;
using TrialP.Products.Services.Abstract;

namespace TrialP.Products.Controllers
{
    [Route("api/[controller]")]
    //[EnableCors("CorsPolicy")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly TrialPProductsContext _context;
        private readonly IEmailService _emailService;
        public OrdersController(TrialPProductsContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        // GET: api/Orders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
        {
            if (_context.Orders == null)
            {
                return NotFound();
            }
            return await _context.Orders.ToListAsync();
        }

        // GET: api/Orders/5asdadasd-asdad-asds-dasd
        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrder(string id)
        {
            Guid guid = Guid.Empty;
            Guid.TryParse(id, out guid);

            if (_context.Orders == null)
            {
                return NotFound();
            }
            var order = await _context.Orders.FindAsync(guid);

            if (order == null)
            {
                return NotFound();
            }

            return order;
        }

        // PUT: api/Orders/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrder(Guid id, Order order)
        {
            if (id != order.Id)
            {
                return BadRequest();
            }

            _context.Entry(order).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderExists(id))
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

        // POST: api/Orders
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Order>> PostOrder(OrderDto order)
        {
            var orderKey = Guid.NewGuid();
            if (_context.Orders == null)
            {
                return Problem("Entity set 'TrialPProductsContext.Orders' is null.");
            }
            order.OrderDate = DateTime.Now;

            var newOrder = order.Orders.Select(o => new Order() { Key= orderKey, PositionsPrimaryId = o, OrderDate = DateTime.Now, UserId = order.UserId, IsCompleted = false });
            _context.Orders.AddRange(newOrder);
            await _context.SaveChangesAsync();

            var orderedPositions = from x in _context.Orders.Include(pos => pos.PositionsPrimary).ThenInclude(pr => pr.Product).AsEnumerable()
                    where x.Key == orderKey
                    group x by x.PositionsPrimaryId.Value into g
                    let count = g.Count()
                    orderby count descending
                    select new { Count = count, PositionsPrimary = (from p in g select p.PositionsPrimary).FirstOrDefault() };

            List<string> stringOrders = new();
            decimal finalPrice = 0;
            foreach (var item in orderedPositions.Distinct())
            {
                stringOrders.Add($"<strong>{item.PositionsPrimary.Product.FullName} - {item.PositionsPrimary.Amount} BYN. Количество: {item.Count}<strong/>");
                finalPrice += item.PositionsPrimary.Amount.Value * item.Count;
            }

            await _emailService.SendEmailAsync(order.Email, $"Номер заказа: {orderKey}<br><h4>Ваш заказ:</h4> {string.Join("<br>", stringOrders)} <br><br><b>Общая цена:</b> {finalPrice} BYN");
            return CreatedAtAction("GetOrder", new { id = order.Email }, order);
        }

        // DELETE: api/Orders/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(Guid id)
        {
            if (_context.Orders == null)
            {
                return NotFound();
            }
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OrderExists(Guid id)
        {
            return (_context.Orders?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
