namespace ClinicAssist.Models
{
    public class Clinic
    {
        public int clinic_id { get; set; }
        public int doctor_id { get; set; }
        public string name { get; set; } = null!;
        public string? address { get; set; }

        public Doctor? doctor { get; set; }
        public ICollection<Clinic_Medicine> Clinic_Medicines { get; set; } = new List<Clinic_Medicine>();
        public ICollection<Assistant> Assistants { get; set; } = new List<Assistant>();
        public ICollection<Patient_Clinic_Registration> Patient_Clinic_Registrations { get; set; } = new List<Patient_Clinic_Registration>();
    }
}
