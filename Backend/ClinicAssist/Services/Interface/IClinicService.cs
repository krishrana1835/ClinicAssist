using ClinicAssist.Dtos.Clinic;
using ClinicAssist.Dtos.Patient;

namespace ClinicAssist.Services.Interface
{
    public interface IClinicService
    {
        Task<List<ClinicResponseDto>> ClinicListAsync(int doctor_id);
        Task<List<PatientListDto>> ListPatientByClinicId(int clinicId, bool recent);
        Task CreateClinic(CreateClinicDto clinicDto);
        Task UpdateClinic(int clinicId, EditClinicDto editClinicDto);
        Task DeleteClinic(int clinicId);
        Task<PatientListResponseDto> GetPatientListWithFilters(int doctorId, string? name, int? clinicId, DateTime? lastVisit, int pageSize, int page);
        Task PatientRegistration(PatientClinicRegistration dto);
    }
}
