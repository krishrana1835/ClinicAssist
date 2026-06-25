using ClinicAssist.Dtos.Clinic;
using ClinicAssist.Dtos.Doctor;

namespace ClinicAssist.Dtos.Documents
{
    public class DocumentResponseDto
    {
        public int DocumentId { get; set; }
        public int PatientId { get; set; }
        public int UploadedByUserId { get; set; }
        public int? OriginClinicId { get; set; }
        public string FileUrl { get; set; } = null!;
        public string? DocumentType { get; set; }
        public DateTime UploadDate { get; set; }

        public ClinicListDto OriginClinic { get; set; } = null!;
        public DocUploadedByDto UploadedBy { get; set; } = null!;
    }
}
