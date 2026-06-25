using ClinicAssist.Data;
using ClinicAssist.Dtos.Patient;
using ClinicAssist.Dtos.Users;
using ClinicAssist.Exceptions;
using ClinicAssist.Models;
using ClinicAssist.Services.Interface;
using Microsoft.EntityFrameworkCore;

namespace ClinicAssist.Services.Implementation
{
    public class PatientService : IPatientService
    {
        private readonly AppDbContext _context;

        public PatientService(AppDbContext context)
        {
            _context = context;
        }

        public async Task CreatePatientAsync(RegisterPatientDto patientDto)
        {
            await using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.email == patientDto.Email);

                if (existingUser != null)
                {
                    throw new BadRequestException("Email is already in use");
                }

                var user = new User
                {
                    email = patientDto.Email,
                    password_hash = BCrypt.Net.BCrypt.HashPassword(patientDto.Password),
                    role = "Doctor",
                    name = patientDto.Name,
                    contact_number = patientDto.ContactNo,
                    created_at = DateTime.UtcNow
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                var patient = new Patient
                {
                    user_id = user.user_id,
                    dob = patientDto.Dob,
                    blood_group = patientDto.BloodGroup,
                    weight = patientDto.Weight,
                    gender = patientDto.Gender
                };

                _context.Patients.Add(patient);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
        public async Task<PatientResponseDto> GetPatientByIdAsync(int patientId)
        {
            var patient = await _context.Patients
                .Include(p => p.user)
                .FirstOrDefaultAsync(p => p.patient_id == patientId);

            if (patient == null || patient.user == null)
            {
                throw new NotFoundException("Patient not found");
            }

            return new PatientResponseDto
            {
                Email = patient.user.email,
                Name = patient.user.name,
                ContactNo = patient.user.contact_number,
                Dob = patient.dob,
                BloodGroup = patient.blood_group,
                Weight = patient.weight,
            };
        }

    }
}
