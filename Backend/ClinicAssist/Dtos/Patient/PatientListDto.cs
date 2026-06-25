namespace ClinicAssist.Dtos.Patient
{
    public class PatientListDto
    {
        public int PatientId { get; set; }
        public int UserId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string ContactNumber { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public DateTime? Dob { get; set; }
        public string? BloodGroup { get; set; }
        public int Weight { get; set; }
        public string Gender { get; set; } = null!;
        public DateTime? LastVisit { get; set; }
    }
}
