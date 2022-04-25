using Bookit.Web.Data.Models;
using Epam.GraphQL.Loaders;
using System;
using System.Linq;
using System.Linq.Expressions;

namespace Bookit.Web.GraphQl.Loaders;

public class MapObjectLoader : MutableLoader<MapObject, int, GraphQlContext>
{
    protected override Expression<Func<MapObject, int>> IdExpression => mapObject => mapObject.Id;

    public override bool IsFakeId(int id) => id < 0;

    protected override IQueryable<MapObject> GetBaseQuery(GraphQlContext context) => context.BookingContext.MapObjects;

    protected override void OnConfigure()
    {
        Field(x => x.Id);
        Field(x => x.Name).Editable();
        Field(x => x.MapId);
        Field(x => x.State);
        Field(x => x.Type);
        Field(x => x.CreatedAt);
        Field(x => x.UpdatedAt);
        Field(x => x.IsDeleted).Editable().Filterable();
        Field("view")
            .FromLoader<MapObjectViewLoader, MapObjectView>(
                (mapObject, mapObjectView) => mapObject.Id == mapObjectView.MapObjectId)
            .SingleOrDefault();
    }

    protected override void BeforeCreate(GraphQlContext context, MapObject entity)
    {
        entity.CreatedAt = DateTime.UtcNow;
        entity.UpdatedAt = DateTime.UtcNow;
    }

    protected override void BeforeUpdate(GraphQlContext context, MapObject entity)
    {
        entity.UpdatedAt = DateTime.UtcNow;
    }
}
