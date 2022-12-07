namespace TrialP.Products.Models.Api
{
    [Serializable]
    public class SearchPage
    {
        public int Limit { get; set; }
        public int Items { get; set; }
        public int Current { get; set; }
        public int Last { get; set; }

    }

    [Serializable]
    public class SearchProduct
    {
        public List<Product> Products { get; set;}
        public SearchPage Page { get; set; }
        public int Total { get; set; }
    }
}
