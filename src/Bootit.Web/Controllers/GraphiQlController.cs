using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System.IO;

namespace Bootit.Web.Controllers
{
    [Route("[controller]")]
    public class GraphiQlController : ControllerBase
    {
        protected string GraphiqlPath = "graphiql.html";

        protected IWebHostEnvironment _webHostEnvironment;

        public GraphiQlController(IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
        }

        [HttpGet]
        public IActionResult Index()
        {
            string wwwRootPath = _webHostEnvironment.WebRootPath;
            var graphiqlHtmlPath = Path.Combine(wwwRootPath, GraphiqlPath);
            var graphiqlHtml = System.IO.File.ReadAllText(graphiqlHtmlPath);

            return Content(graphiqlHtml, "text/html");
        }
    }
}
