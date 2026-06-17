using ClinicAssist.Models;
using Microsoft.EntityFrameworkCore;

namespace ClinicAssist.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // DbSets for all your entities
        public DbSet<User> Users { get; set; }
        public DbSet<Doctor> Doctors { get; set; }
        public DbSet<Clinic> Clinics { get; set; }
        public DbSet<Clinic_Medicine> Clinic_Medicines { get; set; }
        public DbSet<Assistant> Assistants { get; set; }
        public DbSet<Assistant_Permission> Assistant_Permissions { get; set; }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<Patient_Clinic_Registration> Patient_Clinic_Registrations { get; set; }
        public DbSet<Document> Documents { get; set; }
        public DbSet<Document_Access_Permission> Document_Access_Permissions { get; set; }
        public DbSet<Prescription> Prescriptions { get; set; }
        public DbSet<Prescription_Item> Prescription_Items { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ==========================================
            // 1. PRIMARY KEYS (Because we aren't using [Key])
            // ==========================================
            modelBuilder.Entity<User>().HasKey(u => u.user_id);
            modelBuilder.Entity<Doctor>().HasKey(d => d.doctor_id);
            modelBuilder.Entity<Clinic>().HasKey(c => c.clinic_id);
            modelBuilder.Entity<Clinic_Medicine>().HasKey(cm => cm.medicine_id);
            modelBuilder.Entity<Assistant>().HasKey(a => a.assistant_id);
            modelBuilder.Entity<Assistant_Permission>().HasKey(ap => ap.permission_id);
            modelBuilder.Entity<Patient>().HasKey(p => p.patient_id);
            modelBuilder.Entity<Patient_Clinic_Registration>().HasKey(pcr => pcr.registration_id);
            modelBuilder.Entity<Document>().HasKey(d => d.document_id);
            modelBuilder.Entity<Document_Access_Permission>().HasKey(dap => dap.permission_id);
            modelBuilder.Entity<Prescription>().HasKey(p => p.prescription_id);
            modelBuilder.Entity<Prescription_Item>().HasKey(pi => pi.item_id);

            // ==========================================
            // 2. RELATIONSHIPS & FOREIGN KEYS
            // ==========================================

            // --- Doctor ---
            modelBuilder.Entity<Doctor>()
                .HasOne(d => d.user)
                .WithMany(u => u.Doctors)
                .HasForeignKey(d => d.user_id)
                .OnDelete(DeleteBehavior.Restrict);

            // --- Clinic ---
            modelBuilder.Entity<Clinic>()
                .HasOne(c => c.doctor)
                .WithMany(d => d.Clinics)
                .HasForeignKey(c => c.doctor_id)
                .OnDelete(DeleteBehavior.Restrict);

            // --- Clinic_Medicine ---
            modelBuilder.Entity<Clinic_Medicine>()
                .HasOne(cm => cm.clinic)
                .WithMany(c => c.Clinic_Medicines)
                .HasForeignKey(cm => cm.clinic_id)
                .OnDelete(DeleteBehavior.Cascade);

            // --- Assistant ---
            modelBuilder.Entity<Assistant>()
                .HasOne(a => a.user)
                .WithMany(u => u.Assistants)
                .HasForeignKey(a => a.user_id)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Assistant>()
                .HasOne(a => a.clinic)
                .WithMany(c => c.Assistants)
                .HasForeignKey(a => a.clinic_id)
                .OnDelete(DeleteBehavior.Cascade);

            // --- Assistant_Permission ---
            modelBuilder.Entity<Assistant_Permission>()
                .HasOne(ap => ap.assistant)
                .WithMany(a => a.Assistant_Permissions)
                .HasForeignKey(ap => ap.assistant_id)
                .OnDelete(DeleteBehavior.Cascade);

            // --- Patient ---
            modelBuilder.Entity<Patient>()
                .HasOne(p => p.user)
                .WithMany(u => u.Patients)
                .HasForeignKey(p => p.user_id)
                .OnDelete(DeleteBehavior.Restrict);

            // --- Patient_Clinic_Registration ---
            modelBuilder.Entity<Patient_Clinic_Registration>()
                .HasOne(pcr => pcr.patient)
                .WithMany(p => p.Patient_Clinic_Registrations)
                .HasForeignKey(pcr => pcr.patient_id)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Patient_Clinic_Registration>()
                .HasOne(pcr => pcr.clinic)
                .WithMany(c => c.Patient_Clinic_Registrations)
                .HasForeignKey(pcr => pcr.clinic_id)
                .OnDelete(DeleteBehavior.Cascade);

            // --- Document ---
            modelBuilder.Entity<Document>()
                .HasOne(d => d.patient)
                .WithMany(p => p.Documents)
                .HasForeignKey(d => d.patient_id)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Document>()
                .HasOne(d => d.uploaded_by_user)
                .WithMany() // No collection on User to avoid clutter
                .HasForeignKey(d => d.uploaded_by_user_id)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Document>()
                .HasOne(d => d.origin_clinic)
                .WithMany()
                .HasForeignKey(d => d.origin_clinic_id)
                .OnDelete(DeleteBehavior.SetNull);

            // --- Document_Access_Permission ---
            modelBuilder.Entity<Document_Access_Permission>()
                .HasOne(dap => dap.document)
                .WithMany(d => d.Document_Access_Permissions)
                .HasForeignKey(dap => dap.document_id)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Document_Access_Permission>()
                .HasOne(dap => dap.clinic)
                .WithMany()
                .HasForeignKey(dap => dap.clinic_id)
                .OnDelete(DeleteBehavior.Cascade);

            // --- Prescription ---
            modelBuilder.Entity<Prescription>()
                .HasOne(p => p.patient)
                .WithMany(pt => pt.Prescriptions)
                .HasForeignKey(p => p.patient_id)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Prescription>()
                .HasOne(p => p.clinic)
                .WithMany()
                .HasForeignKey(p => p.clinic_id)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Prescription>()
                .HasOne(p => p.doctor)
                .WithMany(d => d.Prescriptions)
                .HasForeignKey(p => p.doctor_id)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Prescription>()
                .HasOne(p => p.created_by_user)
                .WithMany()
                .HasForeignKey(p => p.created_by_user_id)
                .OnDelete(DeleteBehavior.Restrict);

            // --- Prescription_Item ---
            modelBuilder.Entity<Prescription_Item>()
                .HasOne(pi => pi.prescription)
                .WithMany(p => p.Prescription_Items)
                .HasForeignKey(pi => pi.prescription_id)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Prescription_Item>()
                .HasOne(pi => pi.medicine)
                .WithMany()
                .HasForeignKey(pi => pi.medicine_id)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}