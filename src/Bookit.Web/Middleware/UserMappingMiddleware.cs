using Bookit.Web.Data.ViewModels;
using Bookit.Web.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace Bookit.Web.Middleware;

public class UserMappingMiddleware
{
    private static readonly string OrgKey = "orgKey";
    private static readonly string OrgUserIdKey = "orgUserId";
    private static readonly string OrgVerifyCodeKey = "orgVerifyCode";

    private readonly RequestDelegate _next;

    public UserMappingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context, IServiceProvider serviceProvider)
    {
        var query = context.Request.Query;
        var isUserMappingRequest = query.ContainsKey(OrgKey) && query.ContainsKey(OrgUserIdKey) && query.ContainsKey(OrgVerifyCodeKey);

        if (isUserMappingRequest && (context.User?.Identity?.IsAuthenticated ?? false))
        {
            var orgKey = query[OrgKey].Single();
            var orgUserId = query[OrgUserIdKey].Single();
            var orgVerifyCode = query[OrgVerifyCodeKey].Single();

            var input = new UserMappingInput
            {
                ClientOrgKey = orgKey,
                ClientUserId = orgUserId,
                VerificationCode = orgVerifyCode,
            };

            var integrationService = serviceProvider.GetRequiredService<IIntegrationService>();
            if (await integrationService.CanExecuteUserMapping(input))
            {
                await integrationService.ExecuteUserMapping(input);

                var url = context.Request.Path.Value ?? "/";
                var queryString = HttpUtility.ParseQueryString(context.Request.QueryString.Value);
                queryString.Remove(OrgKey);
                queryString.Remove(OrgUserIdKey);
                queryString.Remove(OrgVerifyCodeKey);
                if (queryString.Count > 0)
                {
                    url += "?" + queryString;
                }

                context.Response.Redirect(url);
                return;
            }
        }

        await _next(context);
    }
}
