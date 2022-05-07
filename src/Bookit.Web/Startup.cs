using Bookit.Web.Data;
using Bookit.Web.Data.Models;
using Bookit.Web.GraphQl;
using Bookit.Web.Services;
using Bookit.Web.Services.Implementation;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

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
                options.SignIn.RequireConfirmedAccount = true;
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

        //services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
        //    .AddCookie();

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

        string[] bypass = { "/", "/api/file/upload", "/auth/ping", "/Account/Login", "/Identity/Account/Login", "/Identity/Account/Logout", "/Identity/Account/Register", "/Identity/Account/RegisterConfirmation" };
        app.Use(async (context, next) =>
        {
            var path = context.Request.Path;

            var c1 = !(context.User?.Identity?.IsAuthenticated == true);
            var c2 = !bypass.Any(x => path.Equals(x, StringComparison.OrdinalIgnoreCase));

            if (c1 && path.Equals("/auth/login", StringComparison.OrdinalIgnoreCase))
            {
                context.Response.Redirect($"/Identity/Account/Login?returnUrl=/auth/login");
                return;
            }

            if (c1 && c2)
            {
                context.Response.StatusCode = 401;
                return;
            }

            await next(context);
        });

        // ping
        app.Use(async (context, next) =>
        {
            if (context.Request.Path.Equals("/auth/ping", StringComparison.OrdinalIgnoreCase))
            {
                return;
            }

            await next(context);
        });

        // login
        app.Use(async (context, next) =>
        {
            if (context.Request.Path.Equals("/auth/login", StringComparison.OrdinalIgnoreCase))
            {
                context.Response.ContentType = "text/html";
                await context.Response.WriteAsync("<html><script>window.opener && window.opener.postMessage('authSuccess', '*')</script></html>");
                return;
            }

            await next(context);
        });

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapRazorPages();
            endpoints.MapControllerRoute("graphiql", "graphiql", new { controller = "Graphiql", action = "Index" });
            endpoints.MapFallbackToFile("index.html");
        });
    }
}
