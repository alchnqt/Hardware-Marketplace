namespace TrialP.Products.Models.Api.Shop
{
    public class FromTill
    {
        public string From { get; set; }

        public string Till { get; set; }
    }
    public class OrderProcessing
    {
        public Dictionary<string, FromTill> Schedule { get; set; }
    }
}
