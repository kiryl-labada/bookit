using Bookit.Web.Data;
using Bookit.Web.Data.Models;
using Bookit.Web.Data.ViewModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bookit.Web.Services.Implementation;

public class IntegrationService : IIntegrationService
{
    private readonly IExternalRequestService _externalRequestService;
    private readonly IUserContext _userContext;
    private readonly BookingContext _bookingContext;

    public IntegrationService(
        IExternalRequestService externalRequestService,
        IUserContext userContext,
        BookingContext bookingContext)
    {
        _externalRequestService = externalRequestService;
        _userContext = userContext;
        _bookingContext = bookingContext;
    }

    public async Task<bool> CanExecuteUserMapping(UserMappingInput input)
    {
        var clientOrg = await _bookingContext.ClientOrgs
            .AsNoTracking()
            .Where(x => x.PublicApiKey == input.ClientOrgKey)
            .SingleOrDefaultAsync();

        if (input.ClientUserId == null || input.ClientOrgKey == null)
        {
            throw new ArgumentNullException(nameof(input));
        }

        if (clientOrg == null 
            || clientOrg.ServiceSecretApiKey == null 
            || clientOrg.ServicePublicApiKey == null 
            || clientOrg.ServiceUrl == null)
        {
            return false;
        }

        var response = await _externalRequestService.MakeRequestAsync<UserMappingRequest, UserMappingResponse>(
            clientOrg, new() 
            { 
                UserId = input.ClientUserId, 
                VerifyCode = input.VerificationCode 
            });

        return response?.IsAllowed ?? false;
    }

    public async Task ExecuteUserMapping(UserMappingInput input)
    {
        var clientOrg = await _bookingContext.ClientOrgs
            .AsNoTracking()
            .Where(x => x.PublicApiKey == input.ClientOrgKey)
            .SingleAsync();

        var externalUser = new ExternalUser
        {
            ClientUserId = input.ClientUserId,
            ClientOrgId = clientOrg.Id,
            UserId = _userContext.Id,
        };

        _bookingContext.ExternalUsers.Add(externalUser);
        await _bookingContext.SaveChangesAsync();
    }
}
