using Bookit.Web.Data.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Bookit.Web.Data.EntityConfigurations;

public class ExternalUserEntityTypeConfiguration : IEntityTypeConfiguration<ExternalUser>
{
    public void Configure(EntityTypeBuilder<ExternalUser> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.ClientUserId).IsRequired();

        builder.HasOne(x => x.User)
            .WithMany(x => x.ExternalUsers)
            .HasForeignKey(x => x.UserId);

        builder.HasOne(x => x.ClientOrg)
            .WithMany(x => x.ExternalUsers)
            .HasForeignKey(x => x.ClientOrgId);
    }
}
