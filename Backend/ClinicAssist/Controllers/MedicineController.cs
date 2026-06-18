using ClinicAssist.Common;
using ClinicAssist.Dtos;
using ClinicAssist.Dtos.Medicine;
using ClinicAssist.Services.Interface;
using Microsoft.AspNetCore.Mvc;

namespace ClinicAssist.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicineController : ControllerBase
    {
        private readonly IMedicineService _mediicineService;

        public MedicineController(IMedicineService mediicineService)
        {
            _mediicineService = mediicineService;
        }

        [HttpGet("List/{clinic_id}")]
        public async Task<IActionResult> GetMedicineList(int clinic_id)
        {
            var medicines = await _mediicineService.GetMedicineListAsync(clinic_id);
            return StatusCode(200, new ApiResponse<List<MedicineResponseDto>>(true, "Medicine list fetched", medicines));
        }

        [HttpPost]
        public async Task<IActionResult> AddMedicine(CreateMedicineDto medicineDto)
        {
            await _mediicineService.AddMedicineAsync(medicineDto);
            return StatusCode(201, new ApiResponse<object>(true, "Medicine added"));
        }

        [HttpPut("{medicine_id}")]
        public async Task<IActionResult> UpdateMedicine(int medicine_id, CreateMedicineDto medicineDto)
        {
            await _mediicineService.UpdateMedicineAsync(medicine_id, medicineDto);
            return StatusCode(200, new ApiResponse<object>(true, "Medicine updated"));
        }

        [HttpDelete("{medicine_id}")]
        public async Task<IActionResult> DeleteMedicine(int medicine_id)
        {
            await _mediicineService.DeleteMedicineAsync(medicine_id);
            return StatusCode(200, new ApiResponse<object>(true, "Medicine deleted"));
        }
    }
}
