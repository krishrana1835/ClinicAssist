namespace ClinicAssist.Dtos.Users
{
    public class UserResponse
    {
        public int UserId { get; set; }
        public string Email { get; set; } = null!;
        public string Role { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string ContactNumber { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
    }
}
