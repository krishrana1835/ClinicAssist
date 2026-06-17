using ClinicAssist.Dtos.Auth;
using ClinicAssist.Services.Interface;
using Microsoft.AspNetCore.Mvc;

namespace ClinicAssist.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            var token = await _authService.LoginAsync(request);

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
            return Ok(new
            {
                message = "Login successful",
                accessToken = token,
                session = 1
            });
        }

        [HttpPost("Logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("access_token");

            return Ok();
        }
    }
}