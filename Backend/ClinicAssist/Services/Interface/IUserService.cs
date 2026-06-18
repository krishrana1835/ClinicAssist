using ClinicAssist.Dtos.Users;

namespace ClinicAssist.Services.Interface
{
    public interface IUserService
    {
        Task UpdatePasswordAsync(int userId, string password);
        Task<UserResponse> GetUserByEmail(string email);
    }
}
