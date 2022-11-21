using System;
using System.Collections.Generic;

namespace TrialP.Auth.Models;

public partial class RefreshToken
{
    public Guid? Id { get; set; }

    public string? UserId { get; set; }

    public string? Token { get; set; }

    public DateTime? Expires { get; set; }

    public DateTime? Created { get; set; }
}
