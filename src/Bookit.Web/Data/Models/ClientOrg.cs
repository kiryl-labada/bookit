namespace Bookit.Web.Data.Models;

public class ClientOrg
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? PublicApiKey { get; set; }
    public string? SecretApiKey { get; set; }
    public string? ConfirmUrl { get; set; }

    public string? OwnerId { get; set; }
    public UserProfile? Owner { get; set; }
}
