using Bookit.Web.Data;
using Epam.GraphQL.Mutation;
using Bookit.Web.Data.Models;
using Bookit.Web.Data.Enums;
using System.Threading.Tasks;
using System;
using Bookit.Web.Data.ViewModels;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace Bookit.Web.Services.Implementation;

public class MapService : IMapService
{
    private readonly BookingContext _bookingContext;
    private readonly IUserContext _userContext;

    public MapService(BookingContext bookingContext, IUserContext userContext)
    {
        _bookingContext = bookingContext;
        _userContext = userContext;
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

    public async Task<MutationResult<StatusResponse>> PublishAsync(int mapId)
    {
        var map = await _bookingContext.MapObjects
            .Include(x => x.Prototype)
            .Where(x => x.Id == mapId)
            .SingleOrDefaultAsync();

        var originalMapId = map?.Id ?? throw new ArgumentException(nameof(mapId));
        var draftMapId = map?.Prototype?.Id ?? throw new ArgumentException(nameof(mapId));

        MapObject[] allMapObjects = await _bookingContext.MapObjects
            .Include(x => x.MapObjectView)
            .Where(x => x.Id == originalMapId || x.MapId == originalMapId
                || x.Id == draftMapId || x.MapId == draftMapId)
            .ToArrayAsync();

        Dictionary<int, MapObject> draftMapObjectById = allMapObjects.Where(x => x.InstanceType == InstanceType.Draft).ToDictionary(x => x.Id);
        Dictionary<int, MapObject> originalMapObjectByPrototypeId = allMapObjects.Where(x => x.InstanceType == InstanceType.Original).ToDictionary(x => x.PrototypeId.Value);

        var mapObjectsToAdd = Merge(originalMapId, draftMapId, originalMapObjectByPrototypeId, draftMapObjectById);
        _bookingContext.AddRange(mapObjectsToAdd);

        await _bookingContext.SaveChangesAsync();

        return new MutationResult<StatusResponse>
        { 
            Data = new StatusResponse(true),
            Payload = allMapObjects.Concat(mapObjectsToAdd) 
        };
    }

    private List<MapObject> Merge(int originalMapId, int draftMapId, Dictionary<int, MapObject> originalMapObjectByPrototypeId, Dictionary<int, MapObject> draftMapObjectById)
    {
        var now = DateTime.UtcNow;
        foreach (var (prototypeId, original) in originalMapObjectByPrototypeId)
        {
            var draft = draftMapObjectById.GetValueOrDefault(prototypeId);
            if (draft == null)
            {
                original.IsDeleted = true;
                continue;
            }

            original.Name = draft.Name;
            original.UpdatedAt = now;
            if (original.MapObjectView == null) throw new ArgumentNullException(nameof(original.MapObjectView));
            if (draft.MapObjectView == null) throw new ArgumentNullException(nameof(draft.MapObjectView));
            original.MapObjectView.Structure = draft.MapObjectView.Structure;
            original.MapObjectView.BackgroundUrl = draft.MapObjectView.BackgroundUrl;
            original.MapObjectView.UpdatedAt = now;
        }

        var mapObjectToAdd = new List<MapObject>();
        foreach (var draft in draftMapObjectById.Values)
        {
            if (!originalMapObjectByPrototypeId.ContainsKey(draft.Id))
            {
                var original = new MapObject
                {
                    InstanceType = InstanceType.Original,
                    MapId = originalMapId,
                    Name = draft.Name,
                    CreatedAt = now,
                    UpdatedAt = now,
                    IsDeleted = false,
                    PrototypeId = draft.Id,
                    State = StateType.Draft,
                    Type = draft.Type,
                    MapObjectView = new MapObjectView
                    {
                        Structure = draft.MapObjectView.Structure,
                        BackgroundUrl = draft.MapObjectView.BackgroundUrl,
                        CreatedAt = now,
                        UpdatedAt = now,
                    },
                };

                mapObjectToAdd.Add(original);
            }
        }

        return mapObjectToAdd;
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
            CreatedById = _userContext.Id,
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
