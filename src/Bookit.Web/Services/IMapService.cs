using Bookit.Web.Data.ViewModels;
using Epam.GraphQL.Mutation;
using System.Threading.Tasks;

namespace Bookit.Web.Services;

public interface IMapService
{
    Task<MutationResult<CreateMapResponse>> CreateMapAsync(CreateMapInput input);
}
