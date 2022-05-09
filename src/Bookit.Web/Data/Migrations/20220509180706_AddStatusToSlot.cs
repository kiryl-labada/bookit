using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bookit.Web.Data.Migrations
{
    public partial class AddStatusToSlot : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Status",
                schema: "bookit",
                table: "Slots",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                schema: "bookit",
                table: "Slots");
        }
    }
}
