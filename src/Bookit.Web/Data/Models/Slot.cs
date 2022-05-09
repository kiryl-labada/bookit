using Bookit.Web.Data.Enums;
using System;

namespace Bookit.Web.Data.Models;

public class Slot
{
    public int Id { get; set; }
    public DateTime From { get; set; }
    public DateTime To { get; set; }
    public SlotStatus Status { get; set; }
    public int MapObjectId { get; set; }
    public string? BookedById { get; set; }

    public MapObject? MapObject { get; set; }
    public UserProfile? BookedBy { get; set; }
}
