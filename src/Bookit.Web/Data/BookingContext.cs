using Bookit.Web.Data.EntityConfigurations;
using Bookit.Web.Data.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;

namespace Bookit.Web.Data;

#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.
public class BookingContext : IdentityDbContext<UserProfile>
{
    protected string Schema => "bookit";

    public DbSet<TaskItem> TaskItems { get; set; }
    public DbSet<Story> Stories { get; set; }
    public DbSet<MapObject> MapObjects { get; set; }
    public DbSet<MapObjectView> MapObjectViews { get; set; }
    public DbSet<Slot> Slots { get; set; }
    public DbSet<ClientOrg> ClientOrgs { get; set; }

    public BookingContext(DbContextOptions<BookingContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema(Schema);
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfiguration(new StoryEntityTypeConfiguration());
        modelBuilder.ApplyConfiguration(new TaskItemEntityTypConfiguration());
        modelBuilder.ApplyConfiguration(new MapObjectEntityTypeConfiguration());
        modelBuilder.ApplyConfiguration(new MapObjectViewEntityTypeConfiguration());
        modelBuilder.ApplyConfiguration(new UserProfileEntityTypeConfiguration());
        modelBuilder.ApplyConfiguration(new SlotEntityTypeConfiguration());
        modelBuilder.ApplyConfiguration(new ClientOrgEntityTypeConfiguration());
    }
}

#pragma warning restore CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.
