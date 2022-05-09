using Bookit.Web.Data.Enums;
using Bookit.Web.Data.Models;
using Epam.GraphQL;
using Epam.GraphQL.Loaders;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Bookit.Web.GraphQl.Loaders;

public class MapObjectLoader : MutableLoader<MapObject, int, GraphQlContext>
{
    protected override Expression<Func<MapObject, int>> IdExpression => mapObject => mapObject.Id;

    public override bool IsFakeId(int id) => id < 0;

    protected override IQueryable<MapObject> GetBaseQuery(GraphQlContext context) => context.BookingContext.MapObjects;

    protected override void OnConfigure()
    {
        Field(x => x.Id).Filterable();
        Field(x => x.Name).Editable().Sortable();
        Field(x => x.MapId).Filterable();
        Field(x => x.State);
        Field(x => x.InstanceType);
        Field(x => x.PrototypeId);
        Field(x => x.Type);
        Field(x => x.CreatedById);
        Field(x => x.CreatedAt).Sortable();
        Field(x => x.UpdatedAt).Sortable();
        Field(x => x.IsDeleted).Editable().Filterable();
        Field("view")
            .FromLoader<MapObjectViewLoader, MapObjectView>(
                (mapObject, mapObjectView) => mapObject.Id == mapObjectView.MapObjectId)
            .SingleOrDefault();

        Field("prototype")
            .FromLoader<MapObjectLoader, MapObject>(
                (original, draft) => original.PrototypeId == draft.Id)
            .SingleOrDefault();

        Field("slots")
            .FromLoader<SlotLoader, Slot>((mapObject, slot) => mapObject.Id == slot.MapObjectId)
            .AsConnection();

        Field("isAdmin")
            .FromBatch((context, mapObjects) =>
            {
                return mapObjects.ToDictionary(x => x, x => x.CreatedById == context.UserContext.Id);
            });
    }

    protected override IQueryable<MapObject> ApplySecurityFilter(GraphQlContext context, IQueryable<MapObject> query)
    {
        var currentUserId = context.UserContext.Id;
        return query.Where(x => x.InstanceType != InstanceType.Draft || x.CreatedById == currentUserId);
    }

    protected override Task<bool> CanSaveAsync(IExecutionContextAccessor<GraphQlContext> context, MapObject entity, bool isNew)
    {
        if (!isNew)
        {
            return base.CanSaveAsync(context, entity, isNew);
        }

        var currentUserId = context.UserContext.UserContext.Id;
        return context.UserContext.BookingContext.MapObjects.AnyAsync(x => x.Id == entity.MapId && x.CreatedById == currentUserId);
    }

    protected override void BeforeCreate(GraphQlContext context, MapObject entity)
    {
        entity.CreatedById = context.UserContext.Id;
        entity.CreatedAt = DateTime.UtcNow;
        entity.UpdatedAt = DateTime.UtcNow;
    }

    protected override void BeforeUpdate(GraphQlContext context, MapObject entity)
    {
        entity.UpdatedAt = DateTime.UtcNow;
    }
}
