namespace ClinicAssist.Models
{
    public class Assistant_Permission
    {
        public int permission_id { get; set; }
        public int assistant_id { get; set; }
        public bool can_view_prescriptions { get; set; }
        public bool can_create_prescriptions { get; set; }
        public bool can_view_reports { get; set; }
        public bool can_upload_reports { get; set; }

        public Assistant? assistant { get; set; }
    }
}
