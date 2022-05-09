using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bookit.Web.Data.Models;

public class Slot
{
    public int Id { get; set; }
    public DateTime From { get; set; }
    public DateTime To { get; set; }
    public int MapObjectId { get; set; }
    public string? BookedById { get; set; }

    public MapObject? MapObject { get; set; }
    public UserProfile? BookedBy { get; set; }
}
