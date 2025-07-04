using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BlogApi.Migrations
{
    /// <inheritdoc />
    public partial class UpdateWorkingHoursModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "WeekdayEnd",
                table: "WorkingHours",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "WeekdayStart",
                table: "WorkingHours",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "WeekendEnd",
                table: "WorkingHours",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "WeekendStart",
                table: "WorkingHours",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "WeekdayEnd",
                table: "WorkingHours");

            migrationBuilder.DropColumn(
                name: "WeekdayStart",
                table: "WorkingHours");

            migrationBuilder.DropColumn(
                name: "WeekendEnd",
                table: "WorkingHours");

            migrationBuilder.DropColumn(
                name: "WeekendStart",
                table: "WorkingHours");
        }
    }
}
