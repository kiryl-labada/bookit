using Bootit.Web.GraphQl.Loaders;
using Epam.GraphQL;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bootit.Web.GraphQl
{
    public class GraphQlQuery : Query<GraphQlContext>
    {
        protected override void OnConfigure()
        {
            Connection<StoryLoader>("stories");
            Connection<TaskItemLoader>("tasks");
        }
    }
}
