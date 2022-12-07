using System;
using System.Collections.Generic;

namespace TrialP.Products.Models;

public partial class SubSubCategory
{
    public Guid Id { get; set; }

    public string Name { get; set; }

    public string ApiName { get; set; }

    public Guid? SubCategoryId { get; set; }

    public virtual ICollection<Product> Products { get; } = new List<Product>();

    public virtual SubCategory SubCategory { get; set; }
}
