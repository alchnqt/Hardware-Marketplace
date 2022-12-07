using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace TrialP.Products.Models;

public class PositionPrice
{
    public string Amount { get; set; }
    public string Currency { get; set; }
}

public partial class PositionsPrimary
{
    [JsonIgnore]
    public Guid Id { get; set; }

    [JsonPropertyName("id")]
    public string? ApiId { get; set; }

    public string? Key { get; set; }

    public decimal? Amount { get; set; }
    public string? Currency { get; set;}

    [NotMapped]
    [JsonPropertyName("position_price")]
    public PositionPrice PositionPrice { get; set; }

    public string? Comment { get; set; }
    public string? Importer { get; set; }

    [JsonPropertyName("service_centers")]
    public string? ServiceCenters { get; set; }


    [JsonPropertyName("product_id")]
    public int ProductIdApi { get; set; }


    [JsonIgnore]
    public Guid? ProductId { get; set; }

    public string Article { get; set; }

    [JsonPropertyName("manufacturer_id")]
    public int ManufacturerId { get; set; }

    [JsonPropertyName("shop_id")]
    public int ShopIdApi { get; set; }


    [JsonIgnore]
    public Guid? ShopId { get; set; }
    [JsonIgnore]
    public virtual ICollection<Order> Orders { get; } = new List<Order>();
    [JsonIgnore]
    public virtual Product Product { get; set; }
    [JsonIgnore]
    public virtual ProductShop Shop { get; set; }
}
