namespace ClinicAssist.Models
{
    public class Prescription_Item
    {
        public int item_id { get; set; }
        public int prescription_id { get; set; }
        public int medicine_id { get; set; }
        public string? dosage { get; set; }
        public string? frequency { get; set; }
        public string? duration { get; set; }

        public Prescription? prescription { get; set; }
        public Clinic_Medicine? medicine { get; set; }
    }
}
