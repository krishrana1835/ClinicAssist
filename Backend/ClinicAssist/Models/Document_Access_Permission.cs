namespace ClinicAssist.Models
{
    public class Document_Access_Permission
    {
        public int permission_id { get; set; }
        public int document_id { get; set; }
        public int clinic_id { get; set; }
        public bool is_granted { get; set; }

        public Document? document { get; set; }
        public Clinic? clinic { get; set; }
    }
}
