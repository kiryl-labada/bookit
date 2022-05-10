using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Bookit.Web.Data.Migrations
{
    public partial class AddClientOrgTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ClientOrgs",
                schema: "bookit",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    PublicApiKey = table.Column<string>(type: "text", nullable: true),
                    SecretApiKey = table.Column<string>(type: "text", nullable: true),
                    ConfirmUrl = table.Column<string>(type: "text", nullable: true),
                    OwnerId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClientOrgs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ClientOrgs_AspNetUsers_OwnerId",
                        column: x => x.OwnerId,
                        principalSchema: "bookit",
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_ClientOrgs_OwnerId",
                schema: "bookit",
                table: "ClientOrgs",
                column: "OwnerId",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ClientOrgs",
                schema: "bookit");
        }
    }
}
