using Bootit.Web.Data;
using Bootit.Web.Data.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bootit.Web.Controllers
{
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
                foreach (var task in story.TaskItems)
                {
                    task.Story = null;
                }
            }

            return stories;
        }

        [HttpPost]
        public async Task Post(Story story)
        {
            _context.Stories.Add(story);
            await _context.SaveChangesAsync();
        }
    }
}
