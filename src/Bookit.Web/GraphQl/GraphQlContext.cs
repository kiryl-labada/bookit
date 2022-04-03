using Bookit.Web.Data;
using Microsoft.AspNetCore.Http;
using System;

namespace Bookit.Web.GraphQl;

public class GraphQlContext
{
    public GraphQlContext(IHttpContextAccessor httpContextAccessor, BookingContext bookingContext)
    {
        HttpContext = httpContextAccessor?.HttpContext ?? throw new ArgumentNullException(nameof(httpContextAccessor.HttpContext));
        BookingContext = bookingContext;
    }

    public HttpContext HttpContext { get; }
    public BookingContext BookingContext { get; }
}
