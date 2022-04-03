﻿using Bookit.Web.Data.Models;
using Bookit.Web.GraphQl.Loaders;
using Epam.GraphQL;

namespace Bookit.Web.GraphQl;

public class GraphQlMutation : Mutation<GraphQlContext>
{
    protected override void OnConfigure()
    {
        SubmitField<StoryLoader, Story>("stories");
        SubmitField<TaskItemLoader, TaskItem>("tasks");
        SubmitField<MapObjectLoader, MapObject>("mapObjects");
        SubmitField<MapObjectViewLoader, MapObjectView>("mapObjectViews");
    }
}
