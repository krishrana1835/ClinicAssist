using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClinicAssist.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    user_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    password_hash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    role = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.user_id);
                });

            migrationBuilder.CreateTable(
                name: "Doctors",
                columns: table => new
                {
                    doctor_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    user_id = table.Column<int>(type: "int", nullable: false),
                    name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    specialization = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    contact_number = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Doctors", x => x.doctor_id);
                    table.ForeignKey(
                        name: "FK_Doctors_Users_user_id",
                        column: x => x.user_id,
                        principalTable: "Users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Patients",
                columns: table => new
                {
                    patient_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    user_id = table.Column<int>(type: "int", nullable: false),
                    full_name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    dob = table.Column<DateTime>(type: "datetime2", nullable: true),
                    blood_group = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    weight = table.Column<int>(type: "int", nullable: false),
                    patient_qr_hash = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Patients", x => x.patient_id);
                    table.ForeignKey(
                        name: "FK_Patients_Users_user_id",
                        column: x => x.user_id,
                        principalTable: "Users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Clinics",
                columns: table => new
                {
                    clinic_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    doctor_id = table.Column<int>(type: "int", nullable: false),
                    name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    clinic_qr_hash = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Clinics", x => x.clinic_id);
                    table.ForeignKey(
                        name: "FK_Clinics_Doctors_doctor_id",
                        column: x => x.doctor_id,
                        principalTable: "Doctors",
                        principalColumn: "doctor_id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Assistants",
                columns: table => new
                {
                    assistant_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    user_id = table.Column<int>(type: "int", nullable: false),
                    clinic_id = table.Column<int>(type: "int", nullable: false),
                    name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    contact_number = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    is_active = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Assistants", x => x.assistant_id);
                    table.ForeignKey(
                        name: "FK_Assistants_Clinics_clinic_id",
                        column: x => x.clinic_id,
                        principalTable: "Clinics",
                        principalColumn: "clinic_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Assistants_Users_user_id",
                        column: x => x.user_id,
                        principalTable: "Users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Clinic_Medicines",
                columns: table => new
                {
                    medicine_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    clinic_id = table.Column<int>(type: "int", nullable: false),
                    medicine_name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    description = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Clinic_Medicines", x => x.medicine_id);
                    table.ForeignKey(
                        name: "FK_Clinic_Medicines_Clinics_clinic_id",
                        column: x => x.clinic_id,
                        principalTable: "Clinics",
                        principalColumn: "clinic_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Documents",
                columns: table => new
                {
                    document_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    patient_id = table.Column<int>(type: "int", nullable: false),
                    uploaded_by_user_id = table.Column<int>(type: "int", nullable: false),
                    origin_clinic_id = table.Column<int>(type: "int", nullable: true),
                    file_url = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    document_type = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    upload_date = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Documents", x => x.document_id);
                    table.ForeignKey(
                        name: "FK_Documents_Clinics_origin_clinic_id",
                        column: x => x.origin_clinic_id,
                        principalTable: "Clinics",
                        principalColumn: "clinic_id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Documents_Patients_patient_id",
                        column: x => x.patient_id,
                        principalTable: "Patients",
                        principalColumn: "patient_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Documents_Users_uploaded_by_user_id",
                        column: x => x.uploaded_by_user_id,
                        principalTable: "Users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Patient_Clinic_Registrations",
                columns: table => new
                {
                    registration_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    patient_id = table.Column<int>(type: "int", nullable: false),
                    clinic_id = table.Column<int>(type: "int", nullable: false),
                    registered_at = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Patient_Clinic_Registrations", x => x.registration_id);
                    table.ForeignKey(
                        name: "FK_Patient_Clinic_Registrations_Clinics_clinic_id",
                        column: x => x.clinic_id,
                        principalTable: "Clinics",
                        principalColumn: "clinic_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Patient_Clinic_Registrations_Patients_patient_id",
                        column: x => x.patient_id,
                        principalTable: "Patients",
                        principalColumn: "patient_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Prescriptions",
                columns: table => new
                {
                    prescription_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    patient_id = table.Column<int>(type: "int", nullable: false),
                    clinic_id = table.Column<int>(type: "int", nullable: false),
                    doctor_id = table.Column<int>(type: "int", nullable: false),
                    created_by_user_id = table.Column<int>(type: "int", nullable: false),
                    date_issued = table.Column<DateTime>(type: "datetime2", nullable: false),
                    notes = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Prescriptions", x => x.prescription_id);
                    table.ForeignKey(
                        name: "FK_Prescriptions_Clinics_clinic_id",
                        column: x => x.clinic_id,
                        principalTable: "Clinics",
                        principalColumn: "clinic_id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Prescriptions_Doctors_doctor_id",
                        column: x => x.doctor_id,
                        principalTable: "Doctors",
                        principalColumn: "doctor_id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Prescriptions_Patients_patient_id",
                        column: x => x.patient_id,
                        principalTable: "Patients",
                        principalColumn: "patient_id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Prescriptions_Users_created_by_user_id",
                        column: x => x.created_by_user_id,
                        principalTable: "Users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Assistant_Permissions",
                columns: table => new
                {
                    permission_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    assistant_id = table.Column<int>(type: "int", nullable: false),
                    can_view_prescriptions = table.Column<bool>(type: "bit", nullable: false),
                    can_create_prescriptions = table.Column<bool>(type: "bit", nullable: false),
                    can_view_reports = table.Column<bool>(type: "bit", nullable: false),
                    can_upload_reports = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Assistant_Permissions", x => x.permission_id);
                    table.ForeignKey(
                        name: "FK_Assistant_Permissions_Assistants_assistant_id",
                        column: x => x.assistant_id,
                        principalTable: "Assistants",
                        principalColumn: "assistant_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Document_Access_Permissions",
                columns: table => new
                {
                    permission_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    document_id = table.Column<int>(type: "int", nullable: false),
                    clinic_id = table.Column<int>(type: "int", nullable: false),
                    is_granted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Document_Access_Permissions", x => x.permission_id);
                    table.ForeignKey(
                        name: "FK_Document_Access_Permissions_Clinics_clinic_id",
                        column: x => x.clinic_id,
                        principalTable: "Clinics",
                        principalColumn: "clinic_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Document_Access_Permissions_Documents_document_id",
                        column: x => x.document_id,
                        principalTable: "Documents",
                        principalColumn: "document_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Prescription_Items",
                columns: table => new
                {
                    item_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    prescription_id = table.Column<int>(type: "int", nullable: false),
                    medicine_id = table.Column<int>(type: "int", nullable: false),
                    dosage = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    frequency = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    duration = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Prescription_Items", x => x.item_id);
                    table.ForeignKey(
                        name: "FK_Prescription_Items_Clinic_Medicines_medicine_id",
                        column: x => x.medicine_id,
                        principalTable: "Clinic_Medicines",
                        principalColumn: "medicine_id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Prescription_Items_Prescriptions_prescription_id",
                        column: x => x.prescription_id,
                        principalTable: "Prescriptions",
                        principalColumn: "prescription_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Assistant_Permissions_assistant_id",
                table: "Assistant_Permissions",
                column: "assistant_id");

            migrationBuilder.CreateIndex(
                name: "IX_Assistants_clinic_id",
                table: "Assistants",
                column: "clinic_id");

            migrationBuilder.CreateIndex(
                name: "IX_Assistants_user_id",
                table: "Assistants",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_Clinic_Medicines_clinic_id",
                table: "Clinic_Medicines",
                column: "clinic_id");

            migrationBuilder.CreateIndex(
                name: "IX_Clinics_doctor_id",
                table: "Clinics",
                column: "doctor_id");

            migrationBuilder.CreateIndex(
                name: "IX_Doctors_user_id",
                table: "Doctors",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_Document_Access_Permissions_clinic_id",
                table: "Document_Access_Permissions",
                column: "clinic_id");

            migrationBuilder.CreateIndex(
                name: "IX_Document_Access_Permissions_document_id",
                table: "Document_Access_Permissions",
                column: "document_id");

            migrationBuilder.CreateIndex(
                name: "IX_Documents_origin_clinic_id",
                table: "Documents",
                column: "origin_clinic_id");

            migrationBuilder.CreateIndex(
                name: "IX_Documents_patient_id",
                table: "Documents",
                column: "patient_id");

            migrationBuilder.CreateIndex(
                name: "IX_Documents_uploaded_by_user_id",
                table: "Documents",
                column: "uploaded_by_user_id");

            migrationBuilder.CreateIndex(
                name: "IX_Patient_Clinic_Registrations_clinic_id",
                table: "Patient_Clinic_Registrations",
                column: "clinic_id");

            migrationBuilder.CreateIndex(
                name: "IX_Patient_Clinic_Registrations_patient_id",
                table: "Patient_Clinic_Registrations",
                column: "patient_id");

            migrationBuilder.CreateIndex(
                name: "IX_Patients_user_id",
                table: "Patients",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_Prescription_Items_medicine_id",
                table: "Prescription_Items",
                column: "medicine_id");

            migrationBuilder.CreateIndex(
                name: "IX_Prescription_Items_prescription_id",
                table: "Prescription_Items",
                column: "prescription_id");

            migrationBuilder.CreateIndex(
                name: "IX_Prescriptions_clinic_id",
                table: "Prescriptions",
                column: "clinic_id");

            migrationBuilder.CreateIndex(
                name: "IX_Prescriptions_created_by_user_id",
                table: "Prescriptions",
                column: "created_by_user_id");

            migrationBuilder.CreateIndex(
                name: "IX_Prescriptions_doctor_id",
                table: "Prescriptions",
                column: "doctor_id");

            migrationBuilder.CreateIndex(
                name: "IX_Prescriptions_patient_id",
                table: "Prescriptions",
                column: "patient_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Assistant_Permissions");

            migrationBuilder.DropTable(
                name: "Document_Access_Permissions");

            migrationBuilder.DropTable(
                name: "Patient_Clinic_Registrations");

            migrationBuilder.DropTable(
                name: "Prescription_Items");

            migrationBuilder.DropTable(
                name: "Assistants");

            migrationBuilder.DropTable(
                name: "Documents");

            migrationBuilder.DropTable(
                name: "Clinic_Medicines");

            migrationBuilder.DropTable(
                name: "Prescriptions");

            migrationBuilder.DropTable(
                name: "Clinics");

            migrationBuilder.DropTable(
                name: "Patients");

            migrationBuilder.DropTable(
                name: "Doctors");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
