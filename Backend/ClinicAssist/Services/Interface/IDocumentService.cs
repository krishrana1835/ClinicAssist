using ClinicAssist.Dtos.Document;
using ClinicAssist.Dtos.Documents;

namespace ClinicAssist.Services.Interface
{
    public interface IDocumentService
    {
        Task<List<DocumentResponseDto>> GetDocumentAsync(int clinicId, int patientId);
        Task<string> UploadDocument(UploadDocumentDto uploadDocumentDto, string uploaderId);
        Task<bool> DeleteDocumentAsync(int documentId, string deleterId);
    }
}
