using Bootit.Web.Data.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Bootit.Web.Data.EntityConfigurations
{
    public class StoryEntityTypeConfiguration : IEntityTypeConfiguration<Story>
    {
        public void Configure(EntityTypeBuilder<Story> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Name).IsRequired();

            builder.HasMany(x => x.TaskItems)
                .WithOne(x => x.Story)
                .HasForeignKey(x => x.StoryId);
        }
    }
}
