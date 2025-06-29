using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BlogApi.Migrations
{
    /// <inheritdoc />
    public partial class MultiLangMakale : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Icerik",
                table: "Makaleler",
                newName: "IcerikTr");

            migrationBuilder.RenameColumn(
                name: "Baslik",
                table: "Makaleler",
                newName: "IcerikEn");

            migrationBuilder.AddColumn<string>(
                name: "BaslikEn",
                table: "Makaleler",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "BaslikTr",
                table: "Makaleler",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BaslikEn",
                table: "Makaleler");

            migrationBuilder.DropColumn(
                name: "BaslikTr",
                table: "Makaleler");

            migrationBuilder.RenameColumn(
                name: "IcerikTr",
                table: "Makaleler",
                newName: "Icerik");

            migrationBuilder.RenameColumn(
                name: "IcerikEn",
                table: "Makaleler",
                newName: "Baslik");
        }
    }
}
