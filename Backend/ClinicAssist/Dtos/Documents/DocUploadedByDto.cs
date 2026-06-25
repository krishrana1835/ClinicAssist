namespace ClinicAssist.Dtos.Documents
{
    public class DocUploadedByDto
    {
        public int UserId { get; set; }
        public string Email { get; set; } = null!;
        public string Name { get; set; } = null!;
    }
}
