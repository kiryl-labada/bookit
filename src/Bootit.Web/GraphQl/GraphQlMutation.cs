using Bootit.Web.Data.Models;
using Bootit.Web.GraphQl.Loaders;
using Epam.GraphQL;
using Epam.GraphQL.Loaders;

namespace Bootit.Web.GraphQl
{
    public class GraphQlMutation : Mutation<GraphQlContext>
    {
        protected override void OnConfigure()
        {
            SubmitField<StoryLoader, Story>("stories");
            SubmitField<TaskItemLoader, TaskItem>("tasks");
        }
    }
}
