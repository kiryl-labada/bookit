using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bookit.Web.Data.Models
{
    public class UserProfile : IdentityUser
    {
        public string FullName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public bool IsDeleted { get; set; }

        public ICollection<Slot> Slots { get; set; } = new List<Slot>();
        public ClientOrg? ClientOrg { get; set; }
        public ICollection<ExternalUser> ExternalUsers { get; set; } = new List<ExternalUser>();
    }
}
