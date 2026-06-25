using ClinicAssist.Dtos.Patient;
using ClinicAssist.Dtos.Users;

namespace ClinicAssist.Services.Interface
{
    public interface IPatientService
    {
        Task CreatePatientAsync(RegisterPatientDto patientDto);
        Task<PatientResponseDto> GetPatientByIdAsync(int patientId);
    }
}
