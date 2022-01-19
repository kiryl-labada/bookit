using Bookit.Web.Data.Models;
using Epam.GraphQL.Loaders;
using System;
using System.Linq;
using System.Linq.Expressions;

namespace Bookit.Web.GraphQl.Loaders
{
    public class TaskItemLoader : MutableLoader<TaskItem, int, GraphQlContext>
    {
        protected override Expression<Func<TaskItem, int>> IdExpression => task => task.Id;
        public override bool IsFakeId(int id) => id < 0;
        protected override IQueryable<TaskItem> GetBaseQuery(GraphQlContext context) => context.BookingContext.TaskItems;

        protected override void OnConfigure()
        {
            Field(x => x.Id).Filterable();
            Field(x => x.Name).Editable().Filterable();
            Field(x => x.StoryId).Filterable();

            Field("story")
                .FromLoader<StoryLoader, Story>((taskItem, story) => taskItem.StoryId == story.Id, reverseNavigationProperty: lt => lt.Story)
                .SingleOrDefault();
        }
    }
}
