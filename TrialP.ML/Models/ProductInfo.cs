using Microsoft.ML.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WhoBoughtThisItemAlsoBought
{
    public class ProductInfo
    {
        [KeyType(count: 262111)]
        public uint ProductID { get; set; }
        [KeyType(count: 262111)]
        public uint CombinedProductID { get; set; }
    }
}
