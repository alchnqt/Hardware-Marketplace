namespace TrialP.Products.Models.Api
{
    public class OrderDto
    {
        public List<Guid> Orders { get; set; }

        public DateTime? OrderDate { get; set; }

        public string? Email { get; set; }

        public Guid? UserId { get; set; }
    }
}
