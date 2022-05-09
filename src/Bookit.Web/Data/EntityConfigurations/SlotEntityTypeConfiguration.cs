using Bookit.Web.Data.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Bookit.Web.Data.EntityConfigurations;

public class SlotEntityTypeConfiguration : IEntityTypeConfiguration<Slot>
{
    public void Configure(EntityTypeBuilder<Slot> builder)
    {
        builder.HasKey(x => x.Id);

        builder.HasOne(x => x.MapObject)
            .WithMany(x => x.Slots)
            .HasForeignKey(x => x.MapObjectId);

        builder.HasOne(x => x.BookedBy)
            .WithMany(x => x.Slots)
            .HasForeignKey(x => x.BookedById);
    }
}
