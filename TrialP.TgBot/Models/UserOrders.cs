using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrialP.TgBot.Models
{
    public class UserOrders
    {
        public Guid UserId { get; set; }
        public List<Order> Orders { get; set; }

        public override string ToString()
        {
            StringBuilder sb = new StringBuilder();
            sb.Append($"UserID - {UserId}\n");
            sb.Append($"Orders:\n");
            sb.Append($"{string.Join("\n----------------------\n", Orders)}\n");
            sb.Append($"===============\n");
            return sb.ToString();
        }
    }
}
