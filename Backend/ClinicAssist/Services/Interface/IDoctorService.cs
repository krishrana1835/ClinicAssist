using ClinicAssist.Dtos.Doctor;
using ClinicAssist.Dtos.Users;

namespace ClinicAssist.Services.Interface
{
    public interface IDoctorService
    {
        Task<DoctorResponseDto> GetDoctorProfileAsync(int doctorId);
        Task CreateDoctorAsync(RegisterDoctorDto doctorDto);
        Task UpdateDoctor(int doctorId, UpdateDoctorProfileDto doctorDto);
    }
}
