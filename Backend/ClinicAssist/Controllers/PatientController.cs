using ClinicAssist.Common;
using ClinicAssist.Dtos.Users;
using ClinicAssist.Services.Interface;
using Microsoft.AspNetCore.Mvc;

namespace ClinicAssist.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientController : ControllerBase
    {
        private readonly IPatientService _patientService;

        public PatientController(IPatientService patientService)
        {
            _patientService = patientService;
        }

        [HttpGet("{patientId}")]
        public async Task<IActionResult> GetPatientByIdAsync(int patientId)
        {
            var patient = await _patientService.GetPatientByIdAsync(patientId);
            return StatusCode(200, new ApiResponse<object>(true, "Patient details fetched", patient));
        }

        [HttpPost("")]
        public async Task<IActionResult> CreatePatient(RegisterPatientDto register)
        {
            await _patientService.CreatePatientAsync(register);
            return StatusCode(201, new ApiResponse<object>(true, "Patient created successfully"));
        }
    }
}
