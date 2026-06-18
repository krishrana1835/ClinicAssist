using ClinicAssist.Common;
using ClinicAssist.Dtos.Doctor;
using ClinicAssist.Dtos.Users;
using ClinicAssist.Services.Interface;
using Microsoft.AspNetCore.Mvc;

namespace ClinicAssist.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorController : ControllerBase
    {
        public readonly IDoctorService _doctorService;

        public DoctorController(IDoctorService doctorService)
        {
            _doctorService = doctorService;
        }

        [HttpGet("{doctorId}")]
        public async Task<IActionResult> GetDoctorProfile(int doctorId)
        {
            var doctor = await _doctorService.GetDoctorProfileAsync(doctorId);
            return StatusCode(200, new ApiResponse<DoctorResponseDto>(true, "Doctor profile fetched", doctor));
        }

        [HttpPost("")]
        public async Task<IActionResult> CreateDoctor(RegisterDoctorDto register)
        {
            await _doctorService.CreateDoctorAsync(register);
            return StatusCode(201, new ApiResponse<object>(true, "Doctor created successfully"));
        }

        [HttpPut("{doctor_id}")]
        public async Task<IActionResult> UpdateDoctorProfile(int doctor_id, UpdateDoctorProfileDto register)
        {
            await _doctorService.UpdateDoctor(doctor_id, register);
            return StatusCode(200, new ApiResponse<object>(true, "Profile updated successfully"));
        }
    }
}
