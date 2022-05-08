namespace Bookit.Web.Data.ViewModels;

public class StatusResponse 
{
    public StatusResponse(bool isSuccess)
    {
        IsSuccess = isSuccess;
    }

    public bool IsSuccess { get; set; }
}
