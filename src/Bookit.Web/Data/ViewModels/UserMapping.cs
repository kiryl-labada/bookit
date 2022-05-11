namespace Bookit.Web.Data.ViewModels;

public class UserMappingRequest
{
    public string? UserId { get; set; }
    public string? VerifyCode { get; set; }
}

public class UserMappingResponse
{
    public bool? IsAllowed { get; set; } 
}