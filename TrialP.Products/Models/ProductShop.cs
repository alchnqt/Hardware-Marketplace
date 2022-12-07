using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace TrialP.Products.Models;

public partial class ProductShop
{
    [JsonIgnore]
    public Guid Id { get; set; }

    [JsonPropertyName("id")]
    public int? ApiId { get; set; }

    public string Logo { get; set; }

    public string Title { get; set; }

    public string Url { get; set; }

    public virtual ICollection<PositionsPrimary> PositionsPrimaries { get; } = new List<PositionsPrimary>();
}
