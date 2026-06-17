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

        [HttpGet("/Patient/{clinic_id}")]
        public async Task<IActionResult> GetPatientList(int clinic_id)
        {
            var patientList = await _clinicService.ListPatientByClinicId(clinic_id);

            return Ok(new ApiResponse<List<PatientListDto>>(true, "Patient list", patientList));
        }

        [HttpPost]
        public async Task<IActionResult> CreateClinic(CreateClinicDto createClinicDto)
        {
            await _clinicService.CreateClinic(createClinicDto);
            return Created();
        }

        [HttpPut("{clinic_id}")]
        public async Task<IActionResult> UpdateClinic(int clinic_id, EditClinicDto editClinicDto)
        {
            await _clinicService.UpdateClinic(clinic_id, editClinicDto);
            return Ok();
        }

        [HttpDelete("{clinic_id}")]
        public async Task<IActionResult> DeleteClinic(int clinic_id) 
        {
            await _clinicService.DeleteClinic(clinic_id);
            return Ok();
        }
    }
}