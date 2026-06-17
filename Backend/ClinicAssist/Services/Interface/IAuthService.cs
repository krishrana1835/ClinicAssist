using ClinicAssist.Dtos.Auth;

namespace ClinicAssist.Services.Interface
{
    public interface IAuthService
    {
        string GenerateToken(int userId, string email, string role);
        Task<string> LoginAsync(LoginRequest request);
    }
}
