namespace TrialP.Products.Models
{
    public class Order
    {
        public Guid Id { get; set; }
        public string? Key { get; set; }
        public DateTime? OrderDate { get; set; }
        public bool? IsCompleted { get; set; }  
    }
}
