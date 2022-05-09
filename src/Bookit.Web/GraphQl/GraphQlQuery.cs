using Bookit.Web.GraphQl.Loaders;
using Bookit.Web.GraphQl.Projections;
using Epam.GraphQL;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bookit.Web.GraphQl;

public class GraphQlQuery : Query<GraphQlContext>
{
    protected override void OnConfigure()
    {
        Field("appContext")
            .Resolve(context => new object(), builder => builder.ConfigureFrom<AppContextProjection>());

        Connection<StoryLoader>("stories");
        Connection<TaskItemLoader>("tasks");
        Connection<MapObjectLoader>("mapObjects");
        Connection<MapObjectViewLoader>("mapObjectViews");
        Connection<CatalogItemLoader>("catalogItems");
        Connection<SlotLoader>("slots");
    }
}
