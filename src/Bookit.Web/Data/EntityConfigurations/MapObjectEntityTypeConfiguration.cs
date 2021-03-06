using Bookit.Web.Data.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Bookit.Web.Data.EntityConfigurations;

public class MapObjectEntityTypeConfiguration : IEntityTypeConfiguration<MapObject>
{
    public void Configure(EntityTypeBuilder<MapObject> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Name)
            .IsRequired();

        builder.HasOne(x => x.MapObjectView)
            .WithOne(x => x.MapObject)
            .HasForeignKey<MapObjectView>(x => x.MapObjectId);

        builder.HasOne(x => x.Prototype)
            .WithOne(x => x.Instance)
            .HasForeignKey<MapObject>(x => x.PrototypeId);

        builder.HasOne(x => x.CreatedBy)
            .WithMany()
            .HasForeignKey(x => x.CreatedById);

        builder.HasOne(x => x.Parent)
            .WithMany(x => x.Children)
            .HasForeignKey(x => x.MapId);
    }
}
