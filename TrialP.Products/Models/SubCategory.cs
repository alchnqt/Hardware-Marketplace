using System;
using System.Collections.Generic;

namespace TrialP.Products.Models;

public partial class SubCategory
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string ApiName { get; set; }
    public string Image { get; set; }
    public Guid? CategoryId { get; set; }

    public virtual Category Category { get; set; }

    public virtual ICollection<SubSubCategory> SubSubCategories { get; } = new List<SubSubCategory>();
}
