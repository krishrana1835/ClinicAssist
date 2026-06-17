namespace ClinicAssist.Models
{
    public class Patient_Clinic_Registration
    {
        public int registration_id { get; set; }
        public int patient_id { get; set; }
        public int clinic_id { get; set; }
        public DateTime registered_at { get; set; }
        public DateTime? last_visit { get; set; }

        public Patient? patient { get; set; }
        public Clinic? clinic { get; set; }
    }
}
