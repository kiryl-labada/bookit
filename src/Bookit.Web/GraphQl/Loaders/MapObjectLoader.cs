using Bookit.Web.Data.Models;
using Epam.GraphQL.Loaders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Bookit.Web.GraphQl.Loaders
{
    public class MapObjectLoader : MutableLoader<MapObject, int, GraphQlContext>
    {
        protected override Expression<Func<MapObject, int>> IdExpression => mapObject => mapObject.Id;

        public override bool IsFakeId(int id) => id < 0;

        protected override IQueryable<MapObject> GetBaseQuery(GraphQlContext context) => context.BookingContext.MapObjects;

        protected override void OnConfigure()
        {
            Field(x => x.Id);
            Field(x => x.Name).Editable();
            Field(x => x.CreatedAt);
            Field(x => x.UpdatedAt);
            Field(x => x.IsDeleted).Editable().Filterable();
            //Field("view").FromLoader()
        }
    }
}
