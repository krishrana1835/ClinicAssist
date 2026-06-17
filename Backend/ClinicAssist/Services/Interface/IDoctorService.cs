using ClinicAssist.Dtos.Users;

namespace ClinicAssist.Services.Interface
{
    public interface IDoctorService
    {
        public Task CreateDoctorAsync(RegisterDoctorDto doctorDto);
    }
}
