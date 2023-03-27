using System.Text.Json.Serialization;

namespace TrialP.Products.Models.Api.Shop
{
    public class Customer
    {
        public string Title { get; set; }
        public string Address { get; set; }

        [JsonPropertyName("registration_date")]
        public string RegistrationDate { get; set; }

        [JsonPropertyName("registration_agency")]
        public string RegistrationAgency { get; set; }
    }
}
