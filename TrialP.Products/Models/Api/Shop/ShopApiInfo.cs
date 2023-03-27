using System.Text.Json.Serialization;

namespace TrialP.Products.Models.Api.Shop
{
    public class ShopApiInfo
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Logo { get; set; }

        [JsonPropertyName("registration_date")]
        public DateTime RegistrationDate { get; set; }

        [JsonPropertyName("payment_methods")]
        public Dictionary<string, string> PaymentMethods { get; set; }

        public Customer Customer { get; set; }

        [JsonPropertyName("order_processing")]
        public OrderProcessing OrderProcessing { get; set; }
    }
}
