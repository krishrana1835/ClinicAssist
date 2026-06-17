namespace ClinicAssist.Models
{
    public class Assistant
    {
        public int assistant_id { get; set; }
        public int user_id { get; set; }
        public int clinic_id { get; set; }
        public string name { get; set; } = null!;
        public string? contact_number { get; set; }
        public bool is_active { get; set; }

        public User? user { get; set; }
        public Clinic? clinic { get; set; }
        public ICollection<Assistant_Permission> Assistant_Permissions { get; set; } = new List<Assistant_Permission>();
    }
}
