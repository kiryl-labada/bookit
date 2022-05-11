using System.Collections.Generic;

namespace Bookit.Web.Data.Models;

public class ClientOrg
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? PublicApiKey { get; set; }
    public string? SecretApiKey { get; set; }
    public string? BookingConfirmUrl { get; set; }
    public string? UserMappingUrl { get; set; }

    public string? ServiceUrl { get; set; }
    public string? ServicePublicApiKey { get; set; }
    public string? ServiceSecretApiKey { get; set; }

    public string? OwnerId { get; set; }
    public UserProfile? Owner { get; set; }

    public ICollection<ExternalUser> ExternalUsers { get; set; } = new List<ExternalUser>();
}
