using ClinicAssist.Common;
using ClinicAssist.Dtos.Clinic;
using ClinicAssist.Dtos.Patient;
using ClinicAssist.Services.Interface;
using Microsoft.AspNetCore.Mvc;

namespace ClinicAssist.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClinicController : ControllerBase
    {
        private readonly IClinicService _clinicService;

        public ClinicController(IClinicService clinicService) 
        {
            _clinicService = clinicService;
        }

        [HttpGet("{doctor_id}")]
        public async Task<IActionResult> GetClinicList(int doctor_id)
        {
            var clinicList = await _clinicService.ClinicListAsync(doctor_id);

            return Ok(new ApiResponse<List<ClinicResponseDto>>(true, "Clinic List", clinicList));
        }

        [HttpGet("Patient/{clinic_id}")]
        public async Task<IActionResult> GetPatientList([FromRoute]int clinic_id, [FromQuery]bool recent = false)
        {
            var patientList = await _clinicService.ListPatientByClinicId(clinic_id, recent);

            return Ok(new ApiResponse<List<PatientListDto>>(true, "Patient list", patientList));
        }

        [HttpGet("Patient/Filter/{doctor_id}")]
        public async Task<IActionResult> GetPatientListWithFilter(int doctor_id, string? name, int? clinicId, DateTime? lastVisit, int pageSize = 5, int page = 1)
        {
            var patientList = await _clinicService.GetPatientListWithFilters(doctor_id, name, clinicId, lastVisit, pageSize, page);
            return Ok(new ApiResponse<PatientListResponseDto>(true, "Patient list", patientList));
        }

        [HttpPost]
        public async Task<IActionResult> CreateClinic(CreateClinicDto createClinicDto)
        {
            await _clinicService.CreateClinic(createClinicDto);
            return StatusCode(201, new ApiResponse<object>(true, "Clinic created successfully"));
        }

        [HttpPost("Patient/Register")]
        public async Task<IActionResult> RegisterPatient(PatientClinicRegistration dto)
        {
            await _clinicService.PatientRegistration(dto);
            return StatusCode(201, new ApiResponse<object>(true, "Patient Registered successfully"));
        }

        [HttpPut("{clinic_id}")]
        public async Task<IActionResult> UpdateClinic(int clinic_id, EditClinicDto editClinicDto)
        {
            await _clinicService.UpdateClinic(clinic_id, editClinicDto);
            return StatusCode(200, new ApiResponse<object>(true, "Patient Updated successfully"));
        }

        [HttpDelete("{clinic_id}")]
        public async Task<IActionResult> DeleteClinic(int clinic_id) 
        {
            await _clinicService.DeleteClinic(clinic_id);
            return StatusCode(200, new ApiResponse<object>(true, "Patient deleted successfully"));
        }
    }
}