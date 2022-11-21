using System;
using System.Collections.Generic;

namespace TrialP.Products.Models;

public partial class ShopPhone
{
    public Guid Id { get; set; }

    public string? Phone { get; set; }

    public virtual ICollection<ShopPhoneShopAddress> ShopPhoneShopAddresses { get; } = new List<ShopPhoneShopAddress>();
}
