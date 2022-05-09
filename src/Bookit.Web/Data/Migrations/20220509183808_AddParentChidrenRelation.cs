using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bookit.Web.Data.Migrations
{
    public partial class AddParentChidrenRelation : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_MapObjects_MapId",
                schema: "bookit",
                table: "MapObjects",
                column: "MapId");

            migrationBuilder.AddForeignKey(
                name: "FK_MapObjects_MapObjects_MapId",
                schema: "bookit",
                table: "MapObjects",
                column: "MapId",
                principalSchema: "bookit",
                principalTable: "MapObjects",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MapObjects_MapObjects_MapId",
                schema: "bookit",
                table: "MapObjects");

            migrationBuilder.DropIndex(
                name: "IX_MapObjects_MapId",
                schema: "bookit",
                table: "MapObjects");
        }
    }
}
