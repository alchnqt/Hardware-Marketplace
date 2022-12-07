using System;
using System.Collections.Generic;

namespace TrialP.Products.Models;

public partial class Order
{
    public Guid Id { get; set; }

    public Guid? PositionsPrimaryId { get; set; }

    public bool? IsCompleted { get; set; }

    public DateTime? OrderDate { get; set; }

    public virtual PositionsPrimary PositionsPrimary { get; set; }
}
