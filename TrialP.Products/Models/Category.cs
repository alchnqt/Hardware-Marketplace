using System;
using System.Collections.Generic;

namespace TrialP.Products.Models;

public partial class Category
{
    public Guid Id { get; set; }

    public string? Node { get; set; }

    public int? Left { get; set; }

    public int? Right { get; set; }

    public int? Depth { get; set; }

    public virtual ICollection<Product> Products { get; } = new List<Product>();
}
