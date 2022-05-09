using Bookit.Web.Data;
using Bookit.Web.Data.Enums;
using Bookit.Web.Data.ViewModels;
using Epam.GraphQL.Mutation;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace Bookit.Web.Services.Implementation;

public class BookingService : IBookingService
{
    private readonly BookingContext _bookingContext;
    private readonly IUserContext _userContext;

    public BookingService(BookingContext bookingContext, IUserContext userContext)
    {
        _bookingContext = bookingContext;
        _userContext = userContext;
    }

    public async Task<MutationResult<StatusResponse>> BookPlaceAsync(int placeId)
    {
        var place = await _bookingContext.Slots.SingleOrDefaultAsync(x => x.Id == placeId);
        if (place == null)
        {
            throw new ArgumentException(nameof(placeId));
        }

        if (place.BookedById != null || place.Status != SlotStatus.Available)
        {
            throw new ArgumentException(nameof(place));
        }

        place.BookedById = _userContext.Id;
        place.Status = SlotStatus.Booked;

        return new MutationResult<StatusResponse>
        {
            Data = new StatusResponse(true),
            Payload = new[] { place },
        };
    }
}
