using Microsoft.AspNetCore.Http;
using System;
using System.Threading.Tasks;

namespace Bookit.Web.Middleware;

public class PingMiddleware
{
    private readonly RequestDelegate _next;

    public PingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context)
    {
        if (context.Request.Path.Equals("/auth/ping", StringComparison.OrdinalIgnoreCase))
        {
            return;
        }

        await _next(context);
    }
}
