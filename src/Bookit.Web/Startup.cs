using Bookit.Web.Data;
using Bookit.Web.Data.Models;
using Bookit.Web.GraphQl;
using Bookit.Web.Middleware;
using Bookit.Web.Services;
using Bookit.Web.Services.Implementation;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using System;
using System.Reflection;

namespace Bookit.Web;

public class Startup
{
    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    public void ConfigureServices(IServiceCollection services)
    {
        services.AddDbContext<BookingContext>(options =>
            options.UseNpgsql(Configuration.GetConnectionString(nameof(BookingContext)), npgsqlOptionsAction: sqlOptions =>
            {
                sqlOptions.MigrationsAssembly(typeof(Startup).GetTypeInfo().Assembly.GetName().Name);
                sqlOptions.EnableRetryOnFailure(maxRetryCount: 15, maxRetryDelay: TimeSpan.FromSeconds(30), errorCodesToAdd: null);
            }));

        services.AddDefaultIdentity<UserProfile>(options =>
            {
                options.SignIn.RequireConfirmedAccount = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
            })
            .AddEntityFrameworkStores<BookingContext>();

        services.AddControllers()
            .AddNewtonsoftJson();

        services.AddMvc();

        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "Bookit.Web", Version = "v1" });
        });

        services.AddHttpClient();
        services.AddHttpContextAccessor();

        Setup(services);
    }

    public static void Setup(IServiceCollection services)
    {
        // Add graphql
        services.AddScoped<GraphQlContext>()
            .AddEpamGraphQLSchema<GraphQlQuery, GraphQlMutation, GraphQlContext>();

        DependencyInjection.Setup(services);
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        using (var scope = app.ApplicationServices.GetService<IServiceScopeFactory>()!.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<BookingContext>();
            context.Database.Migrate();
        }
            
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
            app.UseSwagger();
            app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Bookit.Web v1"));
        }

        app.UseHttpsRedirection();
        app.UseStaticFiles();

        app.UseRouting();

        app.UseAuthentication();
        app.UseAuthorization();

        app.UseMiddleware<AuthMiddleware>();
        app.UseMiddleware<PingMiddleware>();
        app.UseMiddleware<LoginMiddleware>();
        app.UseMiddleware<UserMappingMiddleware>();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapRazorPages();
            endpoints.MapControllerRoute("graphiql", "graphiql", new { controller = "Graphiql", action = "Index" });
            endpoints.MapFallbackToFile("index.html");
        });
    }
}
