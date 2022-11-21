using System;
using System.Collections.Generic;

namespace TrialP.Products.Models;

public partial class Product
{
    public Guid Id { get; set; }

    public Guid? CategoryId { get; set; }

    public Guid? ShopId { get; set; }

    public int? ApiId { get; set; }

    public string? ApiKey { get; set; }

    public string? Name { get; set; }

    public string? FullName { get; set; }

    public string? NamePrefix { get; set; }

    public string? ExtendedName { get; set; }

    public string? Status { get; set; }

    public string? ApiImageUrl { get; set; }

    public string? Description { get; set; }

    public string? MicroDescription { get; set; }

    public string? ApiHtmlUrl { get; set; }

    public virtual Category? Category { get; set; }

    public virtual ICollection<ProductReview> ProductReviews { get; } = new List<ProductReview>();

    public virtual Shop? Shop { get; set; }
}
