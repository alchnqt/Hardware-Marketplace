using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrialP.TgBot.Models
{
    public class Order
    {
        public string Name { get; set; }
        public decimal Amount { get; set; }
        public DateTime OrderDate { get; set; }

        public override string ToString()
        {
            return $"\t\t\t\t\t\tТовар - {Name}\n\t\t\t\t\t\tЦена - {Amount} BYN\n\t\t\t\t\t\tВремя заказа - {OrderDate.ToString("MM/dd/yyyy HH:mm")}";
        }
    }
}
