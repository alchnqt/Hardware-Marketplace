using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace TrialP.Products.Models;

public class ApiAuthor
{
    public int Id { get; set; }
    public string Name { get; set; }
}


public partial class Review
{
    private ApiAuthor author;

    [JsonPropertyName("dbId")]
    public Guid Id { get; set; }
    public Guid? UserId { get; set; }

    [JsonPropertyName("id")]
    public int? ApiId { get; set; }
    public int? ApiUserId { get; set; }
    public int? Rating { get; set; }

    [JsonPropertyName("product_id")]
    public string? ApiProductId { get; set; }

    [JsonPropertyName("product_id_db")]
    public Guid? ProductId { get; set; }

    [JsonPropertyName("product_url")]
    public string? ApiProductUrl { get; set; }

    public string? Pros { get; set; }

    public string? Cons { get; set; }

    public string? Summary { get; set; }

    public string? Text { get; set; }

    [JsonPropertyName("created_at")]
    public DateTime? CreatedAt { get; set; }

    [JsonIgnore]
    public virtual Product? Product { get; set; }


    [NotMapped]
    public ApiAuthor Author
    {
        get => author;
        set
        {
            author = value;
            ApiUserId = author.Id;
        }
    }
}