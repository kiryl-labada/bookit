using System;

namespace Bookit.Web.Data.Models;

public class MapObjectView
{
    public int Id { get; set; }
    public string? Structure { get; set; }
    public string? BackgroundUrl { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
