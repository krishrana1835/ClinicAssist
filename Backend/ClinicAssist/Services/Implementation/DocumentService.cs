using ClinicAssist.Data;
using ClinicAssist.Dtos.Clinic;
using ClinicAssist.Dtos.Document;
using ClinicAssist.Dtos.Documents;
using ClinicAssist.Exceptions;
using ClinicAssist.Models;
using ClinicAssist.Services.Interface;
using Microsoft.EntityFrameworkCore;

namespace ClinicAssist.Services.Implementation
{
    public class DocumentService : IDocumentService
    {
        private readonly AppDbContext _context;

        public DocumentService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<DocumentResponseDto>> GetDocumentAsync(int clinicId, int patientId)
        {
            if (!await _context.Clinics.AnyAsync(c => c.clinic_id == clinicId))
                throw new NotFoundException("Clinic does not exist");

            if (!await _context.Patients.AnyAsync(p => p.patient_id == patientId))
                throw new NotFoundException("Patient does not exist");

            var documents = await _context.Documents
                .AsNoTracking()
                .Where(d =>
                    d.patient_id == patientId &&
                    d.Document_Access_Permissions.Any(p => p.clinic_id == clinicId))
                .Select(d => new DocumentResponseDto
                {
                    DocumentId = d.document_id,
                    PatientId = d.patient_id,
                    FileUrl = d.file_url,
                    DocumentType = d.document_type,
                    UploadDate = d.upload_date,
                    UploadedBy = new DocUploadedByDto
                    {
                        UserId = d.uploaded_by_user_id,
                        Name = d.uploaded_by_user.name,
                        Email = d.uploaded_by_user.email
                    },
                    OriginClinic = new ClinicListDto
                    {
                        ClinicId = d.origin_clinic.clinic_id,
                        DoctorId = d.origin_clinic.doctor_id,
                        Address = d.origin_clinic.address,
                        Name = d.origin_clinic.name
                    }
                })
                .OrderByDescending(d => d.UploadDate)
                .ToListAsync();

            return documents;
        }

        public async Task<string> UploadDocument(UploadDocumentDto uploadDocumentDto, string uploaderId)
        {
            if (!int.TryParse(uploaderId, out int uploaderIntId))
            {
                throw new BadRequestException("Uploader ID is not valid.");
            }

            var patient = await _context.Patients.FindAsync(uploadDocumentDto.PatientId);
            if (patient == null)
            {
                throw new NotFoundException("Patient not found");
            }

            var uploader = await _context.Users.FindAsync(uploaderIntId);
            if (uploader == null)
            {
                throw new NotFoundException("Uploader not found");
            }

            var clinic = await _context.Clinics.FindAsync(uploadDocumentDto.ClinicId);
            if (clinic == null)
            {
                throw new NotFoundException("Clinic not found");
            }

            var uploads = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "documents");
            if (!Directory.Exists(uploads))
            {
                Directory.CreateDirectory(uploads);
            }

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadDocumentDto.File.FileName);
            var filePath = Path.Combine(uploads, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await uploadDocumentDto.File.CopyToAsync(stream);
            }

            var document = new Document
            {
                patient_id = uploadDocumentDto.PatientId,
                document_type = uploadDocumentDto.DocumentType,
                file_url = $"/documents/{fileName}",
                uploaded_by_user_id = uploaderIntId,
                upload_date = DateTime.UtcNow,
                origin_clinic_id = uploadDocumentDto.ClinicId
            };

            _context.Documents.Add(document);
            await _context.SaveChangesAsync();

            var permission = new Document_Access_Permission
            {
                document_id = document.document_id,
                clinic_id = uploadDocumentDto.ClinicId,
                is_granted = true
            };

            _context.Document_Access_Permissions.Add(permission);
            await _context.SaveChangesAsync();

            return document.file_url;
        }
        public async Task<bool> DeleteDocumentAsync(int documentId, string deleterId)
        {
            if (!int.TryParse(deleterId, out int deleterIntId))
            {
                throw new BadRequestException("Deleter ID is not valid.");
            }

            var document = await _context.Documents
                .Include(d => d.origin_clinic)
                .FirstOrDefaultAsync(d => d.document_id == documentId);

            if (document == null)
            {
                throw new NotFoundException("Document not found");
            }

            var doctor = await _context.Doctors
                .Include(d => d.Clinics)
                .FirstOrDefaultAsync(d => d.user_id == deleterIntId);

            if (doctor == null)
            {
                throw new NotFoundException("Doctor not found");
            }

            if (document.origin_clinic_id != null && !doctor.Clinics.Any(c => c.clinic_id == document.origin_clinic_id))
            {
                throw new BadRequestException("You are not authorized to delete this document.");
            }

            // Delete physical file
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", document.file_url.TrimStart('/'));
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }

            // Remove permissions
            var permissions = _context.Document_Access_Permissions.Where(p => p.document_id == documentId);
            _context.Document_Access_Permissions.RemoveRange(permissions);

            // Remove document
            _context.Documents.Remove(document);

            return await _context.SaveChangesAsync() > 0;
        }
    }
}
