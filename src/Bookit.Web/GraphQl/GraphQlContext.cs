using Bookit.Web.Data;
using Bookit.Web.Services;
using Microsoft.AspNetCore.Http;
using System;

namespace Bookit.Web.GraphQl;

public class GraphQlContext
{
    public GraphQlContext(IHttpContextAccessor httpContextAccessor, 
        BookingContext bookingContext,
        IUserContext userContext)
    {
        HttpContext = httpContextAccessor?.HttpContext ?? throw new ArgumentNullException(nameof(httpContextAccessor.HttpContext));
        BookingContext = bookingContext;
        UserContext = userContext;
    }

    public HttpContext HttpContext { get; }
    public BookingContext BookingContext { get; }
    public IUserContext UserContext { get; }
}
