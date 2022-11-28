using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartMoving.Data.Migrations
{
    public partial class AddEmployeeNumber : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "EmployeeNumber",
                schema: "Core",
                table: "Customers",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EmployeeNumber",
                schema: "Core",
                table: "Customers");
        }
    }
}
