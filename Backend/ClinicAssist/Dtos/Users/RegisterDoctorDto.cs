namespace ClinicAssist.Dtos.Users
{
    public class RegisterDoctorDto
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string Specialization { get; set; } = null!;
        public string ContactNo { get; set; } = null!;
    }
}
