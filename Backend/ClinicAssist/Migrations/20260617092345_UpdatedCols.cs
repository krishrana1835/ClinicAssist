using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClinicAssist.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedCols : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "clinic_qr_hash",
                table: "Clinics");

            migrationBuilder.DropColumn(
                name: "contact_number",
                table: "Assistants");

            migrationBuilder.DropColumn(
                name: "name",
                table: "Assistants");

            migrationBuilder.AddColumn<int>(
                name: "assistant_id",
                table: "Users",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "doctor_id",
                table: "Users",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "patient_id",
                table: "Users",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "last_visit",
                table: "Patient_Clinic_Registrations",
                type: "datetime2",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_assistant_id",
                table: "Users",
                column: "assistant_id");

            migrationBuilder.CreateIndex(
                name: "IX_Users_doctor_id",
                table: "Users",
                column: "doctor_id");

            migrationBuilder.CreateIndex(
                name: "IX_Users_patient_id",
                table: "Users",
                column: "patient_id");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Assistants_assistant_id",
                table: "Users",
                column: "assistant_id",
                principalTable: "Assistants",
                principalColumn: "assistant_id");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Doctors_doctor_id",
                table: "Users",
                column: "doctor_id",
                principalTable: "Doctors",
                principalColumn: "doctor_id");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Patients_patient_id",
                table: "Users",
                column: "patient_id",
                principalTable: "Patients",
                principalColumn: "patient_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_Assistants_assistant_id",
                table: "Users");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Doctors_doctor_id",
                table: "Users");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Patients_patient_id",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_assistant_id",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_doctor_id",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_patient_id",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "assistant_id",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "doctor_id",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "patient_id",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "last_visit",
                table: "Patient_Clinic_Registrations");

            migrationBuilder.AddColumn<string>(
                name: "clinic_qr_hash",
                table: "Clinics",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "contact_number",
                table: "Assistants",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "name",
                table: "Assistants",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
