using ClinicAssist.Data;
using ClinicAssist.Dtos.Users;
using ClinicAssist.Exceptions;
using ClinicAssist.Services.Interface;
using ClinicAssist.Models;
using Microsoft.EntityFrameworkCore;
using ClinicAssist.Dtos.Doctor;

namespace ClinicAssist.Services.Implementation
{
    public class DoctorService : IDoctorService
    {
        private readonly AppDbContext _context;

        public DoctorService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<DoctorResponseDto> GetDoctorProfileAsync(int doctorId)
        { 
            var doctor = await _context.Doctors.Include(d => d.user).Include(d => d.Clinics).ThenInclude(c => c.Patient_Clinic_Registrations).FirstOrDefaultAsync(d => d.doctor_id == doctorId);
            if(doctor == null)
            {
                throw new NotFoundException("Doctor does not exist");
            }
            var profile = new DoctorResponseDto
            {
                Name = doctor.user.name,
                Email = doctor.user.email,
                ContactNo = doctor.user.contact_number,
                Specialization = doctor.specialization,
                TotalClinic = doctor.Clinics.Count(), 
                TotalPatient = doctor.Clinics.Sum(c => c.Patient_Clinic_Registrations.Count()),
            };
            return profile;
        }

        public async Task CreateDoctorAsync(RegisterDoctorDto doctorDto)
        {
            await using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var existingUser = await _context.Users
                    .FirstOrDefaultAsync(u => u.email == doctorDto.Email);

                if (existingUser != null)
                {
                    throw new BadRequestException("Email is already in use");
                }

                var user = new User
                {
                    email = doctorDto.Email,
                    password_hash = BCrypt.Net.BCrypt.HashPassword(doctorDto.Password),
                    role = "Doctor",
                    name = doctorDto.Name,
                    contact_number = doctorDto.ContactNo,
                    created_at = DateTime.UtcNow
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                var doctor = new Doctor
                {
                    user_id = user.user_id,
                    specialization = doctorDto.Specialization
                };

                _context.Doctors.Add(doctor);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task UpdateDoctor(int doctorId, UpdateDoctorProfileDto doctorDto)
        {
            var doctor = await _context.Doctors.Include(d => d.user).FirstOrDefaultAsync(d => d.doctor_id == doctorId);

            if(doctor == null)
            {
                throw new NotFoundException("Doctor does not exist");
            }

            doctor.specialization = doctorDto.Specialization;
            doctor.user.name = doctorDto.Name;
            doctor.user.email = doctorDto.Email;
            doctor.user.contact_number = doctorDto.ContactNo;

            await _context.SaveChangesAsync();
        }
    }
}
