namespace ClinicAssist.Models
{
    public class Prescription
    {
        public int prescription_id { get; set; }
        public int patient_id { get; set; }
        public int clinic_id { get; set; }
        public int doctor_id { get; set; }
        public int created_by_user_id { get; set; }
        public DateTime date_issued { get; set; }
        public string? notes { get; set; }

        public Patient? patient { get; set; }
        public Clinic? clinic { get; set; }
        public Doctor? doctor { get; set; }
        public User? created_by_user { get; set; }
        public ICollection<Prescription_Item> Prescription_Items { get; set; } = new List<Prescription_Item>();
    }
}
