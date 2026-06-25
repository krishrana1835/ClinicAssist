namespace ClinicAssist.Dtos.Document
{
    public class UploadDocumentDto
    {
        public IFormFile File { get; set; }
        public int PatientId { get; set; }
        public string DocumentType { get; set; }
        public int ClinicId { get; set; }
    }
}
