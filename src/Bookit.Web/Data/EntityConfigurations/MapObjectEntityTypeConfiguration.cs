using Bookit.Web.Data.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bookit.Web.Data.EntityConfigurations
{
    public class MapObjectEntityTypeConfiguration : IEntityTypeConfiguration<MapObject>
    {
        public void Configure(EntityTypeBuilder<MapObject> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Name)
                .IsRequired();
            
            builder.HasOne(x => x.MapObjectView)
                .WithOne()
                .HasForeignKey<MapObjectView>(x => x.Id);
        }
    }
}
