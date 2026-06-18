using ClinicAssist.Dtos.Medicine;

namespace ClinicAssist.Services.Interface
{
    public interface IMedicineService
    {
        Task<List<MedicineResponseDto>> GetMedicineListAsync(int clinicId);
        Task AddMedicineAsync(CreateMedicineDto medicineDto);
        Task UpdateMedicineAsync(int medicineId, CreateMedicineDto medicineDto);
        Task DeleteMedicineAsync(int medicineId);
    }
}
