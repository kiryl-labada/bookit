using Bootit.Web.Data.ViewModels;
using Bootit.Web.GraphQl;
using Epam.GraphQL;
using GraphQL;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bootit.Web.Controllers
{
    [Produces("application/json")]
    [Route("api/graphql")]
    [ApiExplorerSettings(IgnoreApi = false, GroupName = nameof(GraphQlController))]
    public class GraphQlController : Controller
    {
        private readonly IServiceProvider _serviceProvider;

        public GraphQlController(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider ?? throw new ArgumentNullException(nameof(serviceProvider));
        }

        [HttpPost]
        [Route("query")]
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public async Task<object> Query([FromBody] GraphQlRequest request)
        {
            if (request == null)
            {
                throw new ArgumentNullException(nameof(request));
            }


            request.Variables = Convert(request.Variables);

            ExecutionResult result;

            using (var scope = _serviceProvider.CreateScope())
            {
                var schemaExecuter = scope.ServiceProvider.GetRequiredService<ISchemaExecuter<GraphQlQuery, GraphQlMutation, GraphQlContext>>();
                var context = scope.ServiceProvider.GetRequiredService<GraphQlContext>();

                result = await schemaExecuter.ExecuteAsync(optionsBuilder =>
                {
                    optionsBuilder
                        .WithExecutionContext(context)
                        .WithDbContext(context.BookingContext)
                        .ThrowOnUnhandledException()
                        .WithOperationName(request.OperationName)
                        .WithVariables(request.Variables)
                        .Query(request.Query);
                });
            }

            return new { result.Data, Errors = result.Errors?.Select(e => new { e.Path, e.Locations, e.Message }).ToArray() };
        }

        private static Dictionary<string, object> Convert(Dictionary<string, object> variables)
        {
            return variables?.ToDictionary(kv => kv.Key, kv => kv.Value is JToken jToken ? ToObject(jToken) : kv.Value);
        }

        private static object ToObject(JToken token)
        {
            switch (token.Type)
            {
                case JTokenType.Object:
                    return token.Children<JProperty>()
                                .ToDictionary(prop => prop.Name,
                                              prop => ToObject(prop.Value));

                case JTokenType.Array:
                    return token.Select(ToObject).ToList();

                default:
                    return ((JValue)token).Value;
            }
        }
    }
}
