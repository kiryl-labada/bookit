using Bookit.Web.Data;
using Bookit.Web.Data.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bookit.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TaskController : ControllerBase
{
    private readonly BookingContext _context;

    public TaskController(BookingContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IEnumerable<Story>> Get()
    {
        var stories = await _context.Stories
            .AsNoTracking()
            .Include(x => x.TaskItems)
            .ToListAsync();

        foreach (var story in stories)
        {
            foreach (var task in story.TaskItems!)
            {
                task.Story = null;
            }
        }

        return stories;
    }

    [HttpPost]
    public async Task Post()
    {
        var mapObject = new MapObject
        {
            Name = "random name",
            MapId = 3, 
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            State = Data.Enums.StateType.Draft,
            Type = Data.Enums.MapObjectType.Place,
            IsDeleted = false,
        };

        var mapObjectView = new MapObjectView
        {
            BackgroundUrl = null,
            Structure = "{\"rx\": 0, \"ry\": 0, \"top\": 34.11, \"fill\": \"rgba(255,0,0,0.5)\", \"left\": 86.99, \"type\": \"rect\", \"angle\": 0, \"flipX\": false, \"flipY\": false, \"skewX\": 0, \"skewY\": 0, \"width\": 368, \"height\": 254, \"scaleX\": 0.43, \"scaleY\": 0.43, \"shadow\": null, \"stroke\": null, \"opacity\": 1, \"originX\": \"left\", \"originY\": \"top\", \"version\": \"4.6.0\", \"visible\": true, \"fillRule\": \"nonzero\", \"paintFirst\": \"fill\", \"strokeWidth\": 1, \"strokeLineCap\": \"butt\", \"strokeUniform\": false, \"strokeLineJoin\": \"miter\", \"backgroundColor\": \"\", \"strokeDashArray\": null, \"strokeDashOffset\": 0, \"strokeMiterLimit\": 4, \"globalCompositeOperation\": \"source-over\"}",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        mapObject.MapObjectView = mapObjectView;

        //_context.Stories.Add(story);
        _context.MapObjects.Add(mapObject);
        await _context.SaveChangesAsync();
    }
}
