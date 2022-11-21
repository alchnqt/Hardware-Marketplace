using System;
using System.Collections.Generic;

namespace TrialP.Products.Models;

public partial class ShopPhoneShopAddress
{
    public Guid Id { get; set; }

    public Guid? ShopPhonesId { get; set; }

    public Guid? ShopAddressesId { get; set; }

    public virtual ShopAddress? ShopAddresses { get; set; }

    public virtual ShopPhone? ShopPhones { get; set; }

    public virtual ICollection<Shop> Shops { get; } = new List<Shop>();
}
