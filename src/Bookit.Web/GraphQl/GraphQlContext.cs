using Bookit.Web.Data;
using Bookit.Web.Services;
using Microsoft.AspNetCore.Http;
using System;

namespace Bookit.Web.GraphQl;

public class GraphQlContext
{
    public GraphQlContext(IHttpContextAccessor httpContextAccessor,
        IUserContext userContext,
        IMapService mapService,
        BookingContext bookingContext)
    {
        HttpContext = httpContextAccessor?.HttpContext ?? throw new ArgumentNullException(nameof(httpContextAccessor.HttpContext));
        BookingContext = bookingContext;
        UserContext = userContext;
        MapService = mapService;
    }

    public HttpContext HttpContext { get; }
    public BookingContext BookingContext { get; }
    public IUserContext UserContext { get; }
    public IMapService MapService { get; }
}
