using Bookit.Web.Data.Models;
using Bookit.Web.GraphQl.Loaders;
using Epam.GraphQL.Builders.Loader;
using Epam.GraphQL.Loaders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bookit.Web.GraphQl.Projections
{
    public class AppContextProjection : Projection<object, GraphQlContext>
    {
        protected override void OnConfigure()
        {
            Field("user")
                .Resolve((context, _) => context.UserContext);
        }
    }
}
