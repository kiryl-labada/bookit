using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Bookit.Web.Data.Migrations
{
    public partial class AddForeignKeyToMapObjectView : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MapObjectViews_MapObjects_Id",
                schema: "bookit",
                table: "MapObjectViews");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                schema: "bookit",
                table: "MapObjectViews",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<int>(
                name: "MapObjectId",
                schema: "bookit",
                table: "MapObjectViews",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_MapObjectViews_MapObjectId",
                schema: "bookit",
                table: "MapObjectViews",
                column: "MapObjectId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_MapObjectViews_MapObjects_MapObjectId",
                schema: "bookit",
                table: "MapObjectViews",
                column: "MapObjectId",
                principalSchema: "bookit",
                principalTable: "MapObjects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MapObjectViews_MapObjects_MapObjectId",
                schema: "bookit",
                table: "MapObjectViews");

            migrationBuilder.DropIndex(
                name: "IX_MapObjectViews_MapObjectId",
                schema: "bookit",
                table: "MapObjectViews");

            migrationBuilder.DropColumn(
                name: "MapObjectId",
                schema: "bookit",
                table: "MapObjectViews");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                schema: "bookit",
                table: "MapObjectViews",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddForeignKey(
                name: "FK_MapObjectViews_MapObjects_Id",
                schema: "bookit",
                table: "MapObjectViews",
                column: "Id",
                principalSchema: "bookit",
                principalTable: "MapObjects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
