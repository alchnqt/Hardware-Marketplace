using System;
using System.Collections.Generic;

namespace TrialP.Products.Models;

public partial class Category
{
    public Guid Id { get; set; }

    public string Name { get; set; }
    public string ApiName { get; set; }

    public virtual ICollection<SubCategory> SubCategories { get; } = new List<SubCategory>();
}
