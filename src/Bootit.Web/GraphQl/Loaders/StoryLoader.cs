using Bootit.Web.Data.Models;
using Epam.GraphQL.Loaders;
using System;
using System.Linq;
using System.Linq.Expressions;

namespace Bootit.Web.GraphQl.Loaders
{
    public class StoryLoader : MutableLoader<Story, int, GraphQlContext>
    {
        protected override Expression<Func<Story, int>> IdExpression => story => story.Id;
        public override bool IsFakeId(int id) => id < 0;
        protected override IQueryable<Story> GetBaseQuery(GraphQlContext context) => context.BookingContext.Stories;

        protected override void OnConfigure()
        {
            Field(x => x.Id).Filterable();
            Field(x => x.Name).Editable().Filterable();
            Field("tasks")
                .FromLoader<TaskItemLoader, TaskItem>((story, taskItem) => story.Id == taskItem.StoryId)
                .AsConnection();
        }
    }
}
