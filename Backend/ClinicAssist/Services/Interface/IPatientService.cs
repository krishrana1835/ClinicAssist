using ClinicAssist.Dtos.Users;

namespace ClinicAssist.Services.Interface
{
    public interface IPatientService
    {
        public Task CreatePatientAsync(RegisterPatientDto patientDto);
    }
}
