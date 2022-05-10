using Bookit.Web.Data.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Bookit.Web.Data.EntityConfigurations;

public class ClientOrgEntityTypeConfiguration : IEntityTypeConfiguration<ClientOrg>
{
    public void Configure(EntityTypeBuilder<ClientOrg> builder)
    {
        builder.HasKey(x => x.Id);

        builder.HasOne(x => x.Owner)
            .WithOne(x => x.ClientOrg)
            .HasForeignKey<ClientOrg>(x => x.OwnerId);

    }
}
