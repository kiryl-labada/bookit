using Bookit.Web.Data.Models;
using Epam.GraphQL.Loaders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Bookit.Web.GraphQl.Loaders;

public class MapObjectViewLoader : MutableLoader<MapObjectView, int, GraphQlContext>
{
    protected override Expression<Func<MapObjectView, int>> IdExpression => mapObjectView => mapObjectView.Id;

    public override bool IsFakeId(int id) => id < 0;

    protected override IQueryable<MapObjectView> GetBaseQuery(GraphQlContext context) => context.BookingContext.MapObjectViews;

    protected override void OnConfigure()
    {
        Field(x => x.Id);
        Field(x => x.Structure).Editable();
        Field(x => x.BackgroundUrl).Editable();
        Field(x => x.CreatedAt);
        Field(x => x.UpdatedAt);
    }

    protected override void BeforeCreate(GraphQlContext context, MapObjectView entity)
    {
        entity.CreatedAt = DateTime.UtcNow;
        entity.UpdatedAt = DateTime.UtcNow;
    }

    protected override void BeforeUpdate(GraphQlContext context, MapObjectView entity)
    {
        entity.UpdatedAt = DateTime.UtcNow;
    }
}
