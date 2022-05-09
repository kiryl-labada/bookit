using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bookit.Web.Data.Migrations
{
    public partial class AddCreatedByFieldToMapObject : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CreatedById",
                schema: "bookit",
                table: "MapObjects",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_MapObjects_CreatedById",
                schema: "bookit",
                table: "MapObjects",
                column: "CreatedById");

            migrationBuilder.AddForeignKey(
                name: "FK_MapObjects_AspNetUsers_CreatedById",
                schema: "bookit",
                table: "MapObjects",
                column: "CreatedById",
                principalSchema: "bookit",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MapObjects_AspNetUsers_CreatedById",
                schema: "bookit",
                table: "MapObjects");

            migrationBuilder.DropIndex(
                name: "IX_MapObjects_CreatedById",
                schema: "bookit",
                table: "MapObjects");

            migrationBuilder.DropColumn(
                name: "CreatedById",
                schema: "bookit",
                table: "MapObjects");
        }
    }
}
