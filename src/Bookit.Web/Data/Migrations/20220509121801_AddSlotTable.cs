using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Bookit.Web.Data.Migrations
{
    public partial class AddSlotTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Slots",
                schema: "bookit",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    From = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    To = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    MapObjectId = table.Column<int>(type: "integer", nullable: false),
                    BookedById = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Slots", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Slots_AspNetUsers_BookedById",
                        column: x => x.BookedById,
                        principalSchema: "bookit",
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Slots_MapObjects_MapObjectId",
                        column: x => x.MapObjectId,
                        principalSchema: "bookit",
                        principalTable: "MapObjects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Slots_BookedById",
                schema: "bookit",
                table: "Slots",
                column: "BookedById");

            migrationBuilder.CreateIndex(
                name: "IX_Slots_MapObjectId",
                schema: "bookit",
                table: "Slots",
                column: "MapObjectId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Slots",
                schema: "bookit");
        }
    }
}
