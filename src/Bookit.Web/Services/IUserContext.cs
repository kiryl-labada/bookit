using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bookit.Web.Services
{
    public interface IUserContext
    {
        string? Id { get; }
        string Name { get; }
        string Email { get; }
        int? ClientOrgId { get; }
    }
}
