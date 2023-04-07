namespace TrialP.Products.Data.Request
{
    public class CreateReviewDto
    {
        public string Text { get; set; }
        public string Author { get; set; }
        public Guid UserId { get; set; }
        public string ApiProductId { get; set; }
        public Guid ProductId { get; set; }
        public int Rating { get; set; }
        public string? Cons { get; set; }
        public string? Pros { get; set; }
        public string Summary { get; set; }
    }
}
