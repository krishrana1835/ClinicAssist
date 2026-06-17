using System.ComponentModel.DataAnnotations;
using System.Numerics;

namespace ClinicAssist.Models
{
    public class User
    {
        public int user_id { get; set; }
        public string email { get; set; } = null!;
        public string password_hash { get; set; } = null!;
        public string role { get; set; } = null!;
        public string name { get; set; } = null!;
        public string contact_number { get; set; } = null!;
        public DateTime created_at { get; set; }
        public Doctor? doctor { get; set; }
        public Patient? patient { get; set; }
        public Assistant? assistant { get; set; }
        public ICollection<Doctor> Doctors { get; set; } = new List<Doctor>();
        public ICollection<Patient> Patients { get; set; } = new List<Patient>();
        public ICollection<Assistant> Assistants { get; set; } = new List<Assistant>();
    }
}
