using Bookit.Web.Data.EntityConfigurations;
using Bookit.Web.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace Bookit.Web.Data
{
    public class BookingContext : DbContext
    {
        protected string Schema => "bookit";

        public DbSet<TaskItem> TaskItems { get; set; }
        public DbSet<Story> Stories { get; set; }

        public BookingContext(DbContextOptions<BookingContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasDefaultSchema(Schema);
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfiguration(new StoryEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new TaskItemEntityTypConfiguration());
        }
    }
}
