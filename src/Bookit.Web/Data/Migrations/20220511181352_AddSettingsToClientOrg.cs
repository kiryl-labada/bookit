using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Bookit.Web.Data.Migrations
{
    public partial class AddSettingsToClientOrg : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ConfirmUrl",
                schema: "bookit",
                table: "ClientOrgs",
                newName: "UserMappingUrl");

            migrationBuilder.AddColumn<string>(
                name: "BookingConfirmUrl",
                schema: "bookit",
                table: "ClientOrgs",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ServicePublicApiKey",
                schema: "bookit",
                table: "ClientOrgs",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ServiceSecretApiKey",
                schema: "bookit",
                table: "ClientOrgs",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ServiceUrl",
                schema: "bookit",
                table: "ClientOrgs",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ExternalUsers",
                schema: "bookit",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ClientUserId = table.Column<string>(type: "text", nullable: false),
                    ClientOrgId = table.Column<int>(type: "integer", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExternalUsers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ExternalUsers_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalSchema: "bookit",
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ExternalUsers_ClientOrgs_ClientOrgId",
                        column: x => x.ClientOrgId,
                        principalSchema: "bookit",
                        principalTable: "ClientOrgs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ExternalUsers_ClientOrgId",
                schema: "bookit",
                table: "ExternalUsers",
                column: "ClientOrgId");

            migrationBuilder.CreateIndex(
                name: "IX_ExternalUsers_UserId",
                schema: "bookit",
                table: "ExternalUsers",
                column: "UserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ExternalUsers",
                schema: "bookit");

            migrationBuilder.DropColumn(
                name: "BookingConfirmUrl",
                schema: "bookit",
                table: "ClientOrgs");

            migrationBuilder.DropColumn(
                name: "ServicePublicApiKey",
                schema: "bookit",
                table: "ClientOrgs");

            migrationBuilder.DropColumn(
                name: "ServiceSecretApiKey",
                schema: "bookit",
                table: "ClientOrgs");

            migrationBuilder.DropColumn(
                name: "ServiceUrl",
                schema: "bookit",
                table: "ClientOrgs");

            migrationBuilder.RenameColumn(
                name: "UserMappingUrl",
                schema: "bookit",
                table: "ClientOrgs",
                newName: "ConfirmUrl");
        }
    }
}
