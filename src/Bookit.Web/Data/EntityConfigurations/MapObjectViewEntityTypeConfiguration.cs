using Bookit.Web.Data.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Bookit.Web.Data.EntityConfigurations;

public class MapObjectViewEntityTypeConfiguration : IEntityTypeConfiguration<MapObjectView>
{
    public void Configure(EntityTypeBuilder<MapObjectView> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Structure).HasColumnType("jsonb");
    }
}
