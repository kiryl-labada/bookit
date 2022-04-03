using Bookit.Web.Data.Enums;
using System;

namespace Bookit.Web.Data.Models;

public class MapObject
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public int? MapId { get; set; }
    public StateType State { get; set; }
    public MapObjectType Type { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public bool IsDeleted { get; set; }

    public MapObjectView? MapObjectView { get; set; }
}
