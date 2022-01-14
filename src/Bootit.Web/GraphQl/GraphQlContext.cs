using Bootit.Web.Data;
using Microsoft.AspNetCore.Http;

namespace Bootit.Web.GraphQl
{
    public class GraphQlContext
    {
        public GraphQlContext(IHttpContextAccessor httpContextAccessor, BookingContext bookingContext)
        {
            HttpContext = httpContextAccessor?.HttpContext;
            BookingContext = bookingContext;
        }

        public HttpContext HttpContext { get; }
        public BookingContext BookingContext { get; }
    }
}
