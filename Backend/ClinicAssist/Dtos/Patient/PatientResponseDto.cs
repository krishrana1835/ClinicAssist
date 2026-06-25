namespace ClinicAssist.Dtos.Patient
{
    public class PatientResponseDto
    {
        public string Email { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string ContactNo { get; set; } = null!;
        public DateTime? Dob { get; set; }
        public string? BloodGroup { get; set; }
        public int Weight { get; set; }
        public string Gender { get; set; } = "Female";
    }
}
