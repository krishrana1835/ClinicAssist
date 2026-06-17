namespace ClinicAssist.Dtos.Clinic
{
    public class CreateClinicDto
    {
        public int DoctorId {get; set; } 
        public string Name { get; set; } = null!;
        public string? Address { get; set; }
    }
}
