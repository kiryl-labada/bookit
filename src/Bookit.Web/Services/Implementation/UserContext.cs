using Bookit.Web.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;
using System.Security.Claims;

namespace Bookit.Web.Services.Implementation;

public class UserContext : IUserContext
{
    public string? Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public int? ClientOrgId { get; set; }


    public static UserContext Resolve(IServiceProvider sp)
    {
        var httpContext = sp.GetRequiredService<IHttpContextAccessor>().HttpContext;
        var dbContext = sp.GetRequiredService<BookingContext>();

        var userId = httpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var user = dbContext.Users.Single(u => u.Id == userId);
        var clientOrg = dbContext.ClientOrgs.SingleOrDefault(x => x.OwnerId == user.Id);

        return new UserContext
        {
            Id = user?.Id,
            Name = user?.UserName ?? string.Empty,
            Email = user?.Email ?? string.Empty,
            ClientOrgId = clientOrg?.Id,
        };
    }
}
