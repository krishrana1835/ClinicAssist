using ClinicAssist.Data;
using ClinicAssist.Dtos.Clinic;
using ClinicAssist.Dtos.Patient;
using ClinicAssist.Exceptions;
using ClinicAssist.Models;
using ClinicAssist.Services.Interface;
using Microsoft.EntityFrameworkCore;

namespace ClinicAssist.Services.Implementation
{
    public class ClinicService : IClinicService
    {
        private readonly AppDbContext _context;

        public ClinicService(AppDbContext context) 
        { 
            _context = context;
        }

        public async Task<List<ClinicResponseDto>> ClinicListAsync(int doctor_id)
        {
            var list = await _context.Clinics.Include(c => c.Patient_Clinic_Registrations).Select(c => new ClinicResponseDto
            {
                DoctorId = c.doctor_id,
                ClinicId = c.clinic_id,
                Name = c.name,
                Address = c.address,
                TotalPatients = c.Patient_Clinic_Registrations.Count(),
            }).ToListAsync();

            return list;
        }

        public async Task<List<PatientListDto>> ListPatientByClinicId(int clinicId)
        {
            var clinic = await _context.Clinics.FirstOrDefaultAsync(c => c.clinic_id == clinicId);
            if(clinic == null)
            {
                throw new NotFoundException("Invalid clinic id");
            }
            return await _context.Patient_Clinic_Registrations
                .Where(r => r.clinic_id == clinicId)
                .Include(r => r.patient)
                .Select(r => new PatientListDto
                {
                    PatientId = r.patient.patient_id,
                    UserId = r.patient.user_id,
                    Name = r.patient.user.name,
                    ContactNumber = r.patient.user.contact_number,
                    CreatedAt = r.patient.user.created_at,
                    Dob = r.patient.dob,
                    BloodGroup = r.patient.blood_group,
                    Weight = r.patient.weight
                })
                .ToListAsync();
        }

        public async Task CreateClinic(CreateClinicDto clinicDto)
        {
            var clinic = await _context.Clinics.FirstOrDefaultAsync(c => c.name == clinicDto.Name || c.address == clinicDto.Address);

            if(clinic != null)
            {
                throw new BadRequestException("Clinic already exist");
            }

            var newClinic = new Clinic
            {
                doctor_id = clinicDto.DoctorId,
                name = clinicDto.Name,
                address = clinicDto.Address,
            };

            _context.Clinics.Add(newClinic);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateClinic(int clinicId, EditClinicDto editClinicDto)
        {
            var clinic = await _context.Clinics.FirstOrDefaultAsync(c => c.clinic_id == clinicId);
            if (clinic == null)
                throw new NotFoundException("Clinic does not exist");

            clinic.name = editClinicDto.Name;
            clinic.address = editClinicDto.Address;

            await _context.SaveChangesAsync();
        }

        public async Task DeleteClinic(int clinicId)
        {
            var clinic = await _context.Clinics.FirstOrDefaultAsync(c => c.clinic_id == clinicId);

            if (clinic == null)
                throw new NotFoundException("Clinic does not exist");

            _context.Clinics.Remove(clinic);
            await _context.SaveChangesAsync();
        }
    }
}
