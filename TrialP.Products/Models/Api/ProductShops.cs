﻿namespace TrialP.Products.Models.Api
{
    //public class Shops
    //{
    //    public Dictionary<int, ProductShop> Shops { get; set; }
    //}

    public class Positions
    {
        public List<PositionsPrimary> Primary { get; set; }
    }

    public class ProductShops
    {
        public Positions Positions { get; set; }
        public Dictionary<int, ProductShop> Shops { get; set; }
    }
}
