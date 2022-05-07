using Bookit.Web.Data;
using Epam.GraphQL.Mutation;
using Bookit.Web.Data.Models;
using Bookit.Web.Data.Enums;
using System.Threading.Tasks;
using System;
using Bookit.Web.Data.ViewModels;

namespace Bookit.Web.Services.Implementation;

public class MapService : IMapService
{
    private readonly BookingContext _bookingContext;

    public MapService(BookingContext bookingContext)
    {
        _bookingContext = bookingContext;
    }

    public async Task<MutationResult<CreateMapResponse>> CreateMapAsync(CreateMapInput input)
    {
        if (input == null || input.Name == null || input.BackgroundUrl == null)
        {
            throw new ArgumentNullException(nameof(input));
        }

        var original = CreateMap(input.Name, input.BackgroundUrl);
        var draft = CreateMap(input.Name, input.BackgroundUrl);

        original.InstanceType = InstanceType.Original;
        draft.InstanceType = InstanceType.Draft;
        original.Prototype = draft;

        _bookingContext.MapObjects.Add(original);
        await _bookingContext.SaveChangesAsync();

        return new MutationResult<CreateMapResponse>
        {
            Data = new CreateMapResponse
            {
                OriginalMapId = original.Id,
                DraftMapId = draft.Id,
            },
            Payload = new[] { original, draft },
        };
    }

    private MapObject CreateMap(string name, string backgroundUrl)
    {
        var now = DateTime.UtcNow;

        return new MapObject
        {
            Name = name,
            CreatedAt = now,
            UpdatedAt = now,
            State = StateType.Draft,
            Type = MapObjectType.Map,
            IsDeleted = false,
            MapObjectView = new MapObjectView
            {
                BackgroundUrl = backgroundUrl,
                CreatedAt = now,
                UpdatedAt = now,
            },
        };
    }
}
