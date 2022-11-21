using System;
using System.Collections.Generic;

namespace TrialP.Products.Models;

public partial class ShopAddress
{
    public Guid Id { get; set; }

    public string? ApiAddress { get; set; }

    public string? ApiEmail { get; set; }

    public virtual ICollection<ShopPhoneShopAddress> ShopPhoneShopAddresses { get; } = new List<ShopPhoneShopAddress>();
}
