namespace ClinicAssist.Models
{
    public class Doctor
    {
        public int doctor_id { get; set; }
        public int user_id { get; set; }
        public string? specialization { get; set; }

        public User? user { get; set; }
        public ICollection<Clinic> Clinics { get; set; } = new List<Clinic>();
        public ICollection<Prescription> Prescriptions { get; set; } = new List<Prescription>();
    }
}
