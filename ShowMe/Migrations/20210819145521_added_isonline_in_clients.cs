using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace ShowMe.Migrations
{
    public partial class added_isonline_in_clients : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "DateLastOnline",
                table: "Clients",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<bool>(
                name: "IsOnline",
                table: "Clients",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DateLastOnline",
                table: "Clients");

            migrationBuilder.DropColumn(
                name: "IsOnline",
                table: "Clients");
        }
    }
}
