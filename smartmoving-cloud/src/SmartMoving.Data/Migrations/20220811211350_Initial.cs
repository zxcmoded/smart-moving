using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace SmartMoving.Data.Migrations
{
    public partial class Initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "Security");

            migrationBuilder.EnsureSchema(
                name: "Core");

            migrationBuilder.EnsureSchema(
                name: "Logging");

            migrationBuilder.CreateTable(
                name: "Companies",
                schema: "Core",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    CreatedAtUtc = table.Column<DateTimeOffset>(nullable: false),
                    Name = table.Column<string>(maxLength: 250, nullable: false),
                    RandomId = table.Column<string>(maxLength: 20, nullable: true),
                    PhoneNumber = table.Column<string>(maxLength: 20, nullable: true),
                    SmsNumber = table.Column<string>(maxLength: 20, nullable: false),
                    PrimaryColor = table.Column<string>(maxLength: 10, nullable: true),
                    LogoUrl = table.Column<string>(maxLength: 1000, nullable: true),
                    StateLicenseNumber = table.Column<string>(maxLength: 250, nullable: true),
                    Address_Street = table.Column<string>(maxLength: 100, nullable: true),
                    Address_City = table.Column<string>(maxLength: 100, nullable: true),
                    Address_State = table.Column<string>(maxLength: 100, nullable: true),
                    Address_ZipCode = table.Column<string>(maxLength: 100, nullable: true),
                    WebsiteAddress = table.Column<string>(maxLength: 1000, nullable: true),
                    CustomerPortalUrl = table.Column<string>(maxLength: 1000, nullable: true),
                    SocialMediaSettings_GoogleUrl = table.Column<string>(nullable: true),
                    SocialMediaSettings_YelpUrl = table.Column<string>(nullable: true),
                    SocialMediaSettings_FacebookUrl = table.Column<string>(nullable: true),
                    SocialMediaSettings_AngiesListUrl = table.Column<string>(nullable: true),
                    EmailSettings_BackgroundColor = table.Column<string>(maxLength: 10, nullable: true),
                    EmailSettings_FontColor = table.Column<string>(maxLength: 10, nullable: true),
                    EmailSettings_SystemEmailFromAddress = table.Column<string>(maxLength: 100, nullable: true),
                    EmailSettings_Footer = table.Column<string>(nullable: true),
                    EmailSettings_InboundAddress = table.Column<string>(maxLength: 100, nullable: true),
                    EmailSettings_PostmarkServerKey = table.Column<string>(maxLength: 100, nullable: true),
                    LogoDisplay = table.Column<string>(maxLength: 50, nullable: false, defaultValueSql: "'Landscape'"),
                    IanaTzdbTimeZone = table.Column<string>(maxLength: 100, nullable: true),
                    IsEnabled = table.Column<bool>(nullable: false, defaultValue: true),
                    Currency = table.Column<string>(maxLength: 10, nullable: false, defaultValueSql: "'USD'")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Companies", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ApplicationLogs",
                schema: "Logging",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    RequestId = table.Column<string>(maxLength: 60, nullable: true),
                    SessionId = table.Column<string>(maxLength: 60, nullable: true),
                    Host = table.Column<string>(maxLength: 50, nullable: true),
                    Url = table.Column<string>(maxLength: 300, nullable: true),
                    Source = table.Column<string>(maxLength: 300, nullable: true),
                    Type = table.Column<string>(maxLength: 100, nullable: true),
                    Message = table.Column<string>(nullable: true),
                    StackTrace = table.Column<string>(nullable: true),
                    UserName = table.Column<string>(maxLength: 60, nullable: true),
                    CreatedDate = table.Column<DateTimeOffset>(nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApplicationLogs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                schema: "Security",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(nullable: true),
                    CompanyId = table.Column<Guid>(nullable: false),
                    Permissions = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Branches",
                schema: "Core",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    CreatedAtUtc = table.Column<DateTimeOffset>(nullable: false),
                    Name = table.Column<string>(maxLength: 250, nullable: false),
                    PhoneNumber = table.Column<string>(maxLength: 20, nullable: true),
                    CompanyId = table.Column<Guid>(nullable: false),
                    DispatchLocation_FullAddress = table.Column<string>(maxLength: 500, nullable: true),
                    DispatchLocation_Street = table.Column<string>(maxLength: 100, nullable: true),
                    DispatchLocation_Unit = table.Column<string>(maxLength: 100, nullable: true),
                    DispatchLocation_City = table.Column<string>(maxLength: 100, nullable: true),
                    DispatchLocation_State = table.Column<string>(maxLength: 100, nullable: true),
                    DispatchLocation_Zip = table.Column<string>(maxLength: 100, nullable: true),
                    DispatchLocation_Lat = table.Column<decimal>(type: "decimal(10,7)", nullable: false),
                    DispatchLocation_Lng = table.Column<decimal>(type: "decimal(10,7)", nullable: false),
                    MailingAddress_Street = table.Column<string>(maxLength: 100, nullable: true),
                    MailingAddress_City = table.Column<string>(maxLength: 100, nullable: true),
                    MailingAddress_State = table.Column<string>(maxLength: 100, nullable: true),
                    MailingAddress_ZipCode = table.Column<string>(maxLength: 100, nullable: true),
                    IsPrimary = table.Column<bool>(nullable: false),
                    CompanyName = table.Column<string>(maxLength: 250, nullable: true),
                    WebsiteAddress = table.Column<string>(maxLength: 1000, nullable: true),
                    CustomerPortalUrl = table.Column<string>(maxLength: 1000, nullable: true),
                    PrimaryColor = table.Column<string>(maxLength: 10, nullable: true),
                    LogoUrl = table.Column<string>(maxLength: 1000, nullable: true),
                    SocialMediaSettings_GoogleUrl = table.Column<string>(nullable: true),
                    SocialMediaSettings_YelpUrl = table.Column<string>(nullable: true),
                    SocialMediaSettings_FacebookUrl = table.Column<string>(nullable: true),
                    SocialMediaSettings_AngiesListUrl = table.Column<string>(nullable: true),
                    SmsNumber = table.Column<string>(maxLength: 20, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Branches", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Branches_Companies_CompanyId",
                        column: x => x.CompanyId,
                        principalSchema: "Core",
                        principalTable: "Companies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Customers",
                schema: "Core",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    CreatedAtUtc = table.Column<DateTimeOffset>(nullable: false),
                    Name = table.Column<string>(maxLength: 250, nullable: false),
                    PhoneNumber = table.Column<string>(maxLength: 50, nullable: true),
                    PhoneType = table.Column<string>(maxLength: 20, nullable: true),
                    SecondaryPhoneNumbersIndex = table.Column<string>(maxLength: 300, nullable: true),
                    SecondaryPhoneNumbers = table.Column<string>(maxLength: 1000, nullable: true, defaultValueSql: "'[]'"),
                    EmailAddress = table.Column<string>(maxLength: 100, nullable: true),
                    HasAccount = table.Column<bool>(nullable: false),
                    Address = table.Column<string>(maxLength: 500, nullable: true),
                    CompanyId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Customers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Customers_Companies_CompanyId",
                        column: x => x.CompanyId,
                        principalSchema: "Core",
                        principalTable: "Companies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "RoleClaims",
                schema: "Security",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    RoleId = table.Column<Guid>(nullable: false),
                    ClaimType = table.Column<string>(nullable: true),
                    ClaimValue = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RoleClaims_Roles_RoleId",
                        column: x => x.RoleId,
                        principalSchema: "Security",
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                schema: "Security",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    UserName = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(maxLength: 256, nullable: true),
                    Email = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(nullable: false),
                    PasswordHash = table.Column<string>(nullable: true),
                    SecurityStamp = table.Column<string>(nullable: true),
                    ConcurrencyStamp = table.Column<string>(nullable: true),
                    PhoneNumber = table.Column<string>(nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(nullable: false),
                    TwoFactorEnabled = table.Column<bool>(nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(nullable: true),
                    LockoutEnabled = table.Column<bool>(nullable: false),
                    AccessFailedCount = table.Column<int>(nullable: false),
                    CompanyId = table.Column<Guid>(nullable: false),
                    DisplayName = table.Column<string>(nullable: true),
                    MobileNumber = table.Column<string>(nullable: true),
                    CreatedAtUtc = table.Column<DateTimeOffset>(nullable: false),
                    LastLoggedInAppVersion = table.Column<string>(nullable: true),
                    LastLoggedInAt = table.Column<DateTimeOffset>(nullable: true),
                    Deactivated = table.Column<bool>(nullable: false),
                    DeactivatedAtUtc = table.Column<DateTimeOffset>(nullable: true),
                    HireDate = table.Column<int>(nullable: true),
                    TerminationDate = table.Column<int>(nullable: true),
                    Address = table.Column<string>(nullable: true),
                    BranchId = table.Column<Guid>(nullable: true),
                    Title = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Users_Branches_BranchId",
                        column: x => x.BranchId,
                        principalSchema: "Core",
                        principalTable: "Branches",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Users_Companies_CompanyId",
                        column: x => x.CompanyId,
                        principalSchema: "Core",
                        principalTable: "Companies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "UserClaims",
                schema: "Security",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<Guid>(nullable: false),
                    ClaimType = table.Column<string>(nullable: true),
                    ClaimValue = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserClaims_Users_UserId",
                        column: x => x.UserId,
                        principalSchema: "Security",
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserLogins",
                schema: "Security",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(nullable: false),
                    ProviderKey = table.Column<string>(nullable: false),
                    ProviderDisplayName = table.Column<string>(nullable: true),
                    UserId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_UserLogins_Users_UserId",
                        column: x => x.UserId,
                        principalSchema: "Security",
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserRoles",
                schema: "Security",
                columns: table => new
                {
                    UserId = table.Column<Guid>(nullable: false),
                    RoleId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_UserRoles_Roles_RoleId",
                        column: x => x.RoleId,
                        principalSchema: "Security",
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserRoles_Users_UserId",
                        column: x => x.UserId,
                        principalSchema: "Security",
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserTokens",
                schema: "Security",
                columns: table => new
                {
                    UserId = table.Column<Guid>(nullable: false),
                    LoginProvider = table.Column<string>(nullable: false),
                    Name = table.Column<string>(nullable: false),
                    Value = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_UserTokens_Users_UserId",
                        column: x => x.UserId,
                        principalSchema: "Security",
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Branches_CompanyId",
                schema: "Core",
                table: "Branches",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_Customers_CompanyId",
                schema: "Core",
                table: "Customers",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_RoleClaims_RoleId",
                schema: "Security",
                table: "RoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_Roles_Name",
                schema: "Security",
                table: "Roles",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                schema: "Security",
                table: "Roles",
                column: "NormalizedName");

            migrationBuilder.CreateIndex(
                name: "IX_UserClaims_UserId",
                schema: "Security",
                table: "UserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserLogins_UserId",
                schema: "Security",
                table: "UserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserRoles_RoleId",
                schema: "Security",
                table: "UserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_BranchId",
                schema: "Security",
                table: "Users",
                column: "BranchId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_CompanyId",
                schema: "Security",
                table: "Users",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                schema: "Security",
                table: "Users",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                schema: "Security",
                table: "Users",
                column: "NormalizedUserName",
                unique: true,
                filter: "[NormalizedUserName] IS NOT NULL");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Customers",
                schema: "Core");

            migrationBuilder.DropTable(
                name: "ApplicationLogs",
                schema: "Logging");

            migrationBuilder.DropTable(
                name: "RoleClaims",
                schema: "Security");

            migrationBuilder.DropTable(
                name: "UserClaims",
                schema: "Security");

            migrationBuilder.DropTable(
                name: "UserLogins",
                schema: "Security");

            migrationBuilder.DropTable(
                name: "UserRoles",
                schema: "Security");

            migrationBuilder.DropTable(
                name: "UserTokens",
                schema: "Security");

            migrationBuilder.DropTable(
                name: "Roles",
                schema: "Security");

            migrationBuilder.DropTable(
                name: "Users",
                schema: "Security");

            migrationBuilder.DropTable(
                name: "Branches",
                schema: "Core");

            migrationBuilder.DropTable(
                name: "Companies",
                schema: "Core");
        }
    }
}
