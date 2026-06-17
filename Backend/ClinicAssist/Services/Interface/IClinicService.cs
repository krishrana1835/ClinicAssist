using ClinicAssist.Dtos.Clinic;
using ClinicAssist.Dtos.Patient;

namespace ClinicAssist.Services.Interface
{
    public interface IClinicService
    {
        Task<List<ClinicResponseDto>> ClinicListAsync(int doctor_id);
        Task<List<PatientListDto>> ListPatientByClinicId(int clinicId);
        Task CreateClinic(CreateClinicDto clinicDto);
        Task UpdateClinic(int clinicId, EditClinicDto editClinicDto);
        Task DeleteClinic(int clinicId);
    }
}
