using ClinicAssist.Common;
using ClinicAssist.Dtos.Auth;
using ClinicAssist.Dtos.Users;
using ClinicAssist.Services.Interface;
using Microsoft.AspNetCore.Mvc;

namespace ClinicAssist.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IUserService _userService;

        public AuthController(IAuthService authService, IUserService userService)
        {
            _authService = authService;
            _userService = userService;
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            var token = await _authService.LoginAsync(request);

            var user = await _userService.GetUserByEmail(request.Email);

            // 1. HttpOnly secure token cookie (for auth)
            Response.Cookies.Append(
                "access_token",
                token,
                new CookieOptions
                {
                    HttpOnly = true,
                    Secure = false, // true in production (HTTPS)
                    SameSite = SameSiteMode.Lax,
                    Expires = DateTimeOffset.UtcNow.AddDays(7)
                });

            // 2. Normal session cookie (accessible by frontend JS if needed)
            Response.Cookies.Append(
                "session",
                "1",
                new CookieOptions
                {
                    HttpOnly = false, // IMPORTANT: allows frontend access
                    Secure = false,
                    SameSite = SameSiteMode.Lax,
                    Expires = DateTimeOffset.UtcNow.AddDays(7)
                });

            // 3. Send token back to frontend (receiver side)
            return Ok(new ApiResponse<UserResponse>(true, "Login Success", user));
        }

        [HttpPost("Logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("access_token");
            Response.Cookies.Delete("session");

            return Ok(new ApiResponse<object>(true, "Logged out successfully"));
        }
    }
}