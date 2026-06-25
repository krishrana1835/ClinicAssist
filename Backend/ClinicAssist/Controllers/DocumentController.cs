using ClinicAssist.Common;
using ClinicAssist.Dtos.Document;
using ClinicAssist.Dtos.Documents;
using ClinicAssist.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ClinicAssist.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DocumentController : ControllerBase
    {
        private readonly IDocumentService _documentService;

        public DocumentController(IDocumentService documentService)
        {
            _documentService = documentService;
        }

        [HttpGet("List/Clinic/{clinic_id}/Patient/{patient_id}")]
        public async Task<IActionResult> GetDocumentList(int clinic_id, int patient_id)
        {
            var documents = await _documentService.GetDocumentAsync(clinic_id, patient_id);
            return StatusCode(200, new ApiResponse<List<DocumentResponseDto>>(true, "Document List", documents));
        }

        [HttpPost("Upload")]
        public async Task<IActionResult> UploadDocument([FromForm] UploadDocumentDto uploadDocumentDto)
        {
            var uploaderId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(uploaderId))
            {
                return Unauthorized();
            }

            var fileUrl = await _documentService.UploadDocument(uploadDocumentDto, uploaderId);

            return StatusCode(201, new ApiResponse<string>(true, "Document uploaded successfully", fileUrl));
        }
        [HttpDelete("{documentId}")]
        public async Task<IActionResult> DeleteDocument(int documentId)
        {
            var deleterId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(deleterId))
            {
                return Unauthorized();
            }

            var result = await _documentService.DeleteDocumentAsync(documentId, deleterId);

            if(result)
            {
                return Ok(new ApiResponse<string>(true, "Document deleted successfully", null));
            } else
            {
                return StatusCode(500, new ApiResponse<string>(false, "Failed to delete document", null));
            }
        }
    }
}
