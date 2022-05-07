using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bookit.Web.Data.Migrations
{
    public partial class AddInstanceTypeToMapObject : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "InstanceType",
                schema: "bookit",
                table: "MapObjects",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "PrototypeId",
                schema: "bookit",
                table: "MapObjects",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_MapObjects_PrototypeId",
                schema: "bookit",
                table: "MapObjects",
                column: "PrototypeId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_MapObjects_MapObjects_PrototypeId",
                schema: "bookit",
                table: "MapObjects",
                column: "PrototypeId",
                principalSchema: "bookit",
                principalTable: "MapObjects",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MapObjects_MapObjects_PrototypeId",
                schema: "bookit",
                table: "MapObjects");

            migrationBuilder.DropIndex(
                name: "IX_MapObjects_PrototypeId",
                schema: "bookit",
                table: "MapObjects");

            migrationBuilder.DropColumn(
                name: "InstanceType",
                schema: "bookit",
                table: "MapObjects");

            migrationBuilder.DropColumn(
                name: "PrototypeId",
                schema: "bookit",
                table: "MapObjects");
        }
    }
}
