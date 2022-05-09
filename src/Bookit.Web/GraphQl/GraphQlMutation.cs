using Bookit.Web.Data.Models;
using Bookit.Web.Data.ViewModels;
using Bookit.Web.GraphQl.Loaders;
using Epam.GraphQL;

namespace Bookit.Web.GraphQl;

public class GraphQlMutation : Mutation<GraphQlContext>
{
    protected override void OnConfigure()
    {
        SubmitField<StoryLoader, Story>("stories");
        SubmitField<TaskItemLoader, TaskItem>("tasks");
        SubmitField<MapObjectLoader, MapObject>("mapObjects");
        SubmitField<MapObjectViewLoader, MapObjectView>("mapObjectViews");
        SubmitField<SlotLoader, Slot>("slots");

        Field("createMap")
            .PayloadField<CreateMapInput>("input")
            .Resolve((context, input) => context.MapService.CreateMapAsync(input));

        Field("publish")
            .PayloadField<int>("mapId")
            .Resolve((context, mapId) => context.MapService.PublishAsync(mapId));

        Field("book")
            .PayloadField<int>("placeId")
            .Resolve((context, placeId) => context.BookingService.BookPlaceAsync(placeId));
    }
}
