using ClinicAssist.Dtos.Users;

namespace ClinicAssist.Services.Interface
{
    public interface IUserService
    {
        Task<UserResponse> GetUserByEmail(string email);
    }
}
