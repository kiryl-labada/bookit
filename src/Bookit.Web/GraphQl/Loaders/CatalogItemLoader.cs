using Bookit.Web.Data.Models;
using System.Linq;
using Bookit.Web.Data.Enums;

namespace Bookit.Web.GraphQl.Loaders;

public class CatalogItemLoader : MapObjectLoader
{
    protected override IQueryable<MapObject> GetBaseQuery(GraphQlContext context) 
        => base.GetBaseQuery(context).Where(x => x.Type == MapObjectType.Map && x.InstanceType == InstanceType.Original);
}