using System;
using System.Collections.Generic;

namespace TrialP.Products.Models;

public partial class ProductReview
{
    public Guid Id { get; set; }

    public Guid? ProductId { get; set; }

    public int? ApiProductId { get; set; }

    public string? ApiProductUrl { get; set; }

    public string? ApiSummary { get; set; }

    public string? ApiText { get; set; }

    public int? ApiRating { get; set; }

    public string? ApiPros { get; set; }

    public string? ApiCons { get; set; }

    public DateTime? ApiCreated { get; set; }

    public Guid? IdentityUserId { get; set; }

    public virtual Product? Product { get; set; }
}
