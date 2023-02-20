namespace TrialP.Products.Models.Api
{
    public class Page
    {
        public int Current { get; set; }
        public int Items { get; set; }
        public int Last { get; set; }
        public int Limit { get; set; }
    }
    public class ReviewsDto
    {
        public Page Page { get; set; }
        public List<Review> Reviews { get; set; }

        public int Total { get; set; }
    }
}
