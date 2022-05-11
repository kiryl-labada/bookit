using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bookit.Web.Data.ViewModels;

public class UserMappingInput
{
    public string? ClientOrgKey { get; set; }
    public string? ClientUserId { get; set; }
    public string? VerificationCode { get; set; }
}
