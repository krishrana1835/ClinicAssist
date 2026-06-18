using ClinicAssist.Common;
using ClinicAssist.Dtos.Users;
using ClinicAssist.Services.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ClinicAssist.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPut("Password/{userId}")]
        public async Task<IActionResult> UpdatePassword(int userId, UpdatePasswordDto passwordDto)
        {
            await _userService.UpdatePasswordAsync(userId, passwordDto.Password);
            return StatusCode(200, new ApiResponse<object>(true, "Password Updated"));
        }
    }
}
