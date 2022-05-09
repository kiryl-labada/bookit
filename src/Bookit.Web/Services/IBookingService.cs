using Bookit.Web.Data.ViewModels;
using Epam.GraphQL.Mutation;
using System.Threading.Tasks;

namespace Bookit.Web.Services;

public interface IBookingService
{
    Task<MutationResult<StatusResponse>> BookPlaceAsync(int placeId);
}
