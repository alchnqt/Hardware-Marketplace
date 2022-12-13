﻿using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace TrialP.Products.Models;

public partial class Order
{
    public Guid Id { get; set; }

    public Guid? Key { get; set; }

    public Guid? PositionsPrimaryId { get; set; }

    public Guid? UserId { get; set; }

    public bool? IsCompleted { get; set; }

    public DateTime? OrderDate { get; set; }

    [NotMapped]
    public string? Email { get; set; }

    [JsonIgnore]
    public virtual PositionsPrimary PositionsPrimary { get; set; }
}
