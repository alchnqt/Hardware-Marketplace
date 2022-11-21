using System;
using System.Collections.Generic;

namespace TrialP.Products.Models;

public partial class Shop
{
    public Guid Id { get; set; }

    public Guid? ShopPhoneShopAddressesId { get; set; }

    public string? ApiUrl { get; set; }

    public string? ApiFullInfoUrl { get; set; }

    public string? ApiFullTitle { get; set; }

    public string? ApiHtmlUrl { get; set; }

    public string? ApiTitle { get; set; }

    public string? ApiLogo { get; set; }

    public virtual ICollection<Product> Products { get; } = new List<Product>();

    public virtual ShopPhoneShopAddress? ShopPhoneShopAddresses { get; set; }
}
