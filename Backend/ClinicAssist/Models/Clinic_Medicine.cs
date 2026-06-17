namespace ClinicAssist.Models
{
    public class Clinic_Medicine
    {
        public int medicine_id { get; set; }
        public int clinic_id { get; set; }
        public string medicine_name { get; set; } = null!;
        public string? description { get; set; }

        public Clinic? clinic { get; set; }
    }
}
