using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bookit.Web.Middleware;

public class AuthMiddleware
{
    private readonly RequestDelegate _next;

    public AuthMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context)
    {
        var path = context.Request.Path;

        var isAuthenticated = context.User?.Identity?.IsAuthenticated ?? false;
        var isApiCall = path.StartsWithSegments("/api");
        var isLoginCall = path.StartsWithSegments("/Identity/Account");

        if (!isAuthenticated && isApiCall)
        {
            context.Response.StatusCode = 401;
            return;
        }

        if (!isAuthenticated && !isLoginCall)
        {
            string url = UriHelper.GetEncodedPathAndQuery(context.Request);
            context.Response.Redirect($"/Identity/Account/Login?returnUrl={url}");
            return;
        }

        await _next(context);
    }
}
