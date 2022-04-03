using System.Collections.Generic;

namespace Bookit.Web.Data.ViewModels
{
    public class GraphQlRequest
    {
        public string? OperationName { get; set; }
        public string? Query { get; set; }
        public Dictionary<string, object?>? Variables { get; set; }
    }
}
