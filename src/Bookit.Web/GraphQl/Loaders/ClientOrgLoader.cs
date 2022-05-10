using Bookit.Web.Data.Models;
using Bookit.Web.Helpers;
using Epam.GraphQL;
using Epam.GraphQL.Loaders;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Bookit.Web.GraphQl.Loaders;

public class ClientOrgLoader : MutableLoader<ClientOrg, int, GraphQlContext>
{
    protected override Expression<Func<ClientOrg, int>> IdExpression => x => x.Id;

    public override bool IsFakeId(int id) => id < 0;

    protected override IQueryable<ClientOrg> GetBaseQuery(GraphQlContext context) 
        => context.BookingContext.ClientOrgs.Where(x => x.OwnerId == context.UserContext.Id);

    protected override void OnConfigure()
    {
        Field(x => x.Id);
        Field(x => x.Name).Editable();
        Field(x => x.OwnerId);
        Field(x => x.PublicApiKey);
        Field(x => x.SecretApiKey);
        Field(x => x.ConfirmUrl).Editable();
    }

    protected override async Task<bool> CanSaveAsync(IExecutionContextAccessor<GraphQlContext> context, ClientOrg entity, bool isNew)
    {
        var currentUserId = context.UserContext.UserContext.Id;
        if (isNew)
        {
            return !(await context.UserContext.BookingContext.ClientOrgs.AnyAsync(x => x.OwnerId == currentUserId));
        }

        return await base.CanSaveAsync(context, entity, isNew);
    }

    protected override void BeforeCreate(GraphQlContext context, ClientOrg entity)
    {
        entity.OwnerId = context.UserContext.Id;
        entity.PublicApiKey = GenerateKey();
        entity.SecretApiKey = GenerateKey();
    }

    private string GenerateKey() => GuidHelper.Encode(Guid.NewGuid());
}
