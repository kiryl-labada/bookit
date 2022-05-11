using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bookit.Web.Data.Models;

public class ExternalUser
{
    public int Id { get; set; }
    public string? ClientUserId { get; set; }
    public int ClientOrgId { get; set; }
    public string? UserId { get; set; }

    public UserProfile? User { get; set; }
    public ClientOrg? ClientOrg { get; set; }
}
