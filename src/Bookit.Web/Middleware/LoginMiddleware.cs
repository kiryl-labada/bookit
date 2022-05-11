using Microsoft.AspNetCore.Http;
using System;
using System.Threading.Tasks;

namespace Bookit.Web.Middleware;

public class LoginMiddleware
{
    private readonly RequestDelegate _next;

    public LoginMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context)
    {
        if (context.Request.Path.Equals("/auth/login", StringComparison.OrdinalIgnoreCase))
        {
            context.Response.ContentType = "text/html";
            await context.Response.WriteAsync("<html><script>window.opener && window.opener.postMessage('authSuccess', '*')</script></html>");
            return;
        }

        await _next(context);
    }
}
