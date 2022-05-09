using Bookit.Web.Data;
using Bookit.Web.Services.Implementation;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Bookit.Web.Services
{
    public static class DependencyInjection
    {
        public static void Setup(IServiceCollection services)
        {
            services.AddScoped<IUserContext>(UserContext.Resolve);
            services.AddTransient<IMapService, MapService>();
            services.AddTransient<IBookingService, BookingService>();
        }
    }
}
