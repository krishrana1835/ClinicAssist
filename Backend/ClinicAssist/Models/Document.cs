namespace ClinicAssist.Models
{
    public class Document
    {
        public int document_id { get; set; }
        public int patient_id { get; set; }
        public int uploaded_by_user_id { get; set; }
        public int? origin_clinic_id { get; set; }
        public string file_url { get; set; } = null!;
        public string? document_type { get; set; }
        public DateTime upload_date { get; set; }

        public Patient? patient { get; set; }
        public User? uploaded_by_user { get; set; }
        public Clinic? origin_clinic { get; set; }
        public ICollection<Document_Access_Permission> Document_Access_Permissions { get; set; } = new List<Document_Access_Permission>();
    }
}
