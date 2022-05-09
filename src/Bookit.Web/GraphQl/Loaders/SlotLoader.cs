using Bookit.Web.Data.Models;
using Epam.GraphQL.Loaders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Bookit.Web.GraphQl.Loaders;

public class SlotLoader : MutableLoader<Slot, int, GraphQlContext>
{
    protected override Expression<Func<Slot, int>> IdExpression => x => x.Id;
    public override bool IsFakeId(int id) => id < 0;
    protected override IQueryable<Slot> GetBaseQuery(GraphQlContext context) => context.BookingContext.Slots;

    protected override void OnConfigure()
    {
        Field(x => x.Id).Filterable();
        Field(x => x.From).Filterable().Sortable();
        Field(x => x.To).Filterable();
        Field(x => x.Status).Editable().Filterable();
        Field(x => x.MapObjectId).Filterable();
        Field(x => x.BookedById);
        Field("mapObject")
            .FromLoader<MapObjectLoader, MapObject>((slot, mapObject) => slot.MapObjectId == mapObject.Id)
            .SingleOrDefault();

        Field("bookedBy")
            .FromLoader<UserProfileLoader, UserProfile>((slot, userProfile) => slot.BookedById == userProfile.Id)
            .SingleOrDefault();
    }
}
