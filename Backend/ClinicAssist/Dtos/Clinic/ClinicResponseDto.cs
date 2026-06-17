namespace ClinicAssist.Dtos.Clinic
{
    public class ClinicResponseDto
    {
        public int ClinicId { get; set; }
        public int DoctorId { get; set; }
        public string Name { get; set; } = null!;
        public string? Address { get; set; }
        public int TotalPatients { get; set; }
    }
}
