namespace ClinicAssist.Dtos.Doctor
{
    public class DoctorResponseDto
    {
        public string Email { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string Specialization { get; set; } = null!;
        public string ContactNo { get; set; } = null!;
        public int TotalPatient { get; set; } = 0;
        public int TotalClinic { get; set; } = 0;
    }
}
