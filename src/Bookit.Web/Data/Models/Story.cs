using System.Collections.Generic;

namespace Bookit.Web.Data.Models;

public class Story
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public ICollection<TaskItem>? TaskItems { get; set; }
}
