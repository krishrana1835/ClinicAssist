using System.Reflection.Metadata;

namespace ClinicAssist.Models
{
    public class Patient
    {
        public int patient_id { get; set; }
        public int user_id { get; set; }
        public DateTime? dob { get; set; }
        public string? blood_group { get; set; }
        public int weight { get; set; }

        public User? user { get; set; }
        public ICollection<Patient_Clinic_Registration> Patient_Clinic_Registrations { get; set; } = new List<Patient_Clinic_Registration>();
        public ICollection<Document> Documents { get; set; } = new List<Document>();
        public ICollection<Prescription> Prescriptions { get; set; } = new List<Prescription>();
    }
}
