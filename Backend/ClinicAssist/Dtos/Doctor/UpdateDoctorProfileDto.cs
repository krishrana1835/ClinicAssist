namespace ClinicAssist.Dtos.Doctor
{
    public class UpdateDoctorProfileDto
    {
        public string Email { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string Specialization { get; set; } = null!;
        public string ContactNo { get; set; } = null!;
    }
}
