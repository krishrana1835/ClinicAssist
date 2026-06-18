using ClinicAssist.Data;
using ClinicAssist.Dtos.Medicine;
using ClinicAssist.Exceptions;
using ClinicAssist.Services.Interface;
using Microsoft.EntityFrameworkCore;

namespace ClinicAssist.Services.Implementation
{
    public class MedicineService : IMedicineService
    {
        private readonly AppDbContext _context;

        public MedicineService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<MedicineResponseDto>> GetMedicineListAsync(int clinicId)
        {
            if(!await _context.Clinics.AnyAsync(c => c.clinic_id == clinicId))
            {
                throw new NotFoundException("Clinic does not exist");
            }

            return await _context.Clinic_Medicines.Where(m => m.clinic_id == clinicId).Select(m => new MedicineResponseDto
            {
                MedicineId = m.medicine_id,
                ClinicId = m.clinic_id,
                MedicineName = m.medicine_name,
                Description = m.description,
                Stock = m.stock,
            }).ToListAsync();
        }

        public async Task AddMedicineAsync(CreateMedicineDto medicineDto)
        {
            if(!await _context.Clinics.AnyAsync(c => c.clinic_id == medicineDto.ClinicId))
            {
                throw new NotFoundException("Clinic does not exist");
            }

            if(await _context.Clinic_Medicines.AnyAsync(m => m.medicine_name == medicineDto.MedicineName))
            {
                throw new BadRequestException("Medicine already exist");
            }

            _context.Clinic_Medicines.Add(new Models.Clinic_Medicine
            {
                clinic_id = medicineDto.ClinicId,
                medicine_name = medicineDto.MedicineName,
                description = medicineDto.Description,
                stock = medicineDto.Stock,
            });

            await _context.SaveChangesAsync();
        }

        public async Task UpdateMedicineAsync(int medicineId, CreateMedicineDto medicineDto)
        {
            if (!await _context.Clinics.AnyAsync(c => c.clinic_id == medicineDto.ClinicId))
            {
                throw new NotFoundException("Clinic does not exist");
            }

            var medicine = await _context.Clinic_Medicines.FirstOrDefaultAsync(m => m.medicine_id == medicineId);

            if(medicine == null)
            {
                throw new NotFoundException("Medicine does not exist");
            }

            medicine.medicine_name = medicineDto.MedicineName;
            medicine.description = medicineDto.Description;
            medicine.stock = medicineDto.Stock;

            await _context.SaveChangesAsync();
        }

        public async Task DeleteMedicineAsync(int medicineId)
        {
            var medicine = await _context.Clinic_Medicines.FirstOrDefaultAsync(m => m.medicine_id == medicineId);

            if (medicine == null)
            {
                throw new NotFoundException("Medicine does not exist");
            }

            _context.Clinic_Medicines.Remove(medicine);
            await _context.SaveChangesAsync();
        }
    }
}