using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bookit.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FileController : Controller
{
    private readonly IWebHostEnvironment _appEnvironment;

    public FileController(IWebHostEnvironment appEnvironment)
    {
        _appEnvironment = appEnvironment;
    }

    [Route("upload")]
    [HttpPost]
    public async Task<IActionResult> Upload(IFormFile file)
    {
        if (file == null)
        {
            return BadRequest();
        }


        var fileId = Guid.NewGuid();
        string path = "/images/" + fileId.ToString() + file.FileName.Substring(file.FileName.Length - 4);
        using (var fileStream = new FileStream(_appEnvironment.WebRootPath + path, FileMode.Create))
        {
            await file.CopyToAsync(fileStream);
        }

        var type = file.ContentType?.Split("/")[0];
        if (type != "image")
        {
            type = "attachment";
        }

        var fileVM = new
        {
            Id = fileId,
            Name = file.FileName,
            Size = file.Length,
            Type = type,
            Path = path,
        };

        return Created(path, fileVM);
    }
}
