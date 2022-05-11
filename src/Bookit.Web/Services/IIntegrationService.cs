using Bookit.Web.Data.ViewModels;
using System.Threading.Tasks;

namespace Bookit.Web.Services;

public interface IIntegrationService
{
    Task<bool> CanExecuteUserMapping(UserMappingInput input);
    Task ExecuteUserMapping(UserMappingInput input);
}
