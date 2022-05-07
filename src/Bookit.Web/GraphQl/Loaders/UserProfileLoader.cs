using Bookit.Web.Data.Models;
using Epam.GraphQL.Loaders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Bookit.Web.GraphQl.Loaders;

public class UserProfileLoader : IdentifiableLoader<UserProfile, string, GraphQlContext>
{
    protected override Expression<Func<UserProfile, string>> IdExpression => x => x.Id;
    protected override IQueryable<UserProfile> GetBaseQuery(GraphQlContext context) => context.BookingContext.Users;

    protected override void OnConfigure()
    {
        Field(x => x.Id);
        Field(x => x.FullName);
        Field(x => x.Email);
    }
}
