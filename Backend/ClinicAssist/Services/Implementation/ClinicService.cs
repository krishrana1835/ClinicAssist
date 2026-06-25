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

        public async Task<List<PatientListDto>> ListPatientByClinicId(int clinicId, bool recent)
        {
            var clinic = await _context.Clinics.FirstOrDefaultAsync(c => c.clinic_id == clinicId);
            if(clinic == null)
            {
                throw new NotFoundException("Invalid clinic id");
            }
            return await _context.Patient_Clinic_Registrations
                .Where(r =>
                    r.clinic_id == clinicId &&
                    (!recent ||
                     (r.last_visit != null &&
                      r.last_visit >= DateTime.Now.AddDays(-3))))
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
                    Weight = r.patient.weight,
                    Gender = r.patient.gender,
                    LastVisit = r.last_visit
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

        public async Task PatientRegistration(PatientClinicRegistration dto)
        {
            if(!await _context.Patients.AnyAsync(p => p.patient_id == dto.PatientId))
            {
                throw new NotFoundException("Patient does not exist");
            }
            if(!await _context.Clinics.AnyAsync(c => c.clinic_id == dto.ClinicId))
            {
                throw new NotFoundException("Clinic does not exist");
            }
            _context.Patient_Clinic_Registrations.Add(new Patient_Clinic_Registration
            {
                patient_id = dto.PatientId,
                clinic_id = dto.ClinicId,
                registered_at = DateTime.Now
            });
            await _context.SaveChangesAsync();
        }

        public async Task<PatientListResponseDto> GetPatientListWithFilters( int doctorId, string? name, int? clinicId, DateTime? lastVisit, int pageSize, int page)
        {
            if (!await _context.Doctors.AnyAsync(d => d.doctor_id == doctorId))
                throw new NotFoundException("Doctor does not exist");

            var query = _context.Patients.AsQueryable();

            if (!string.IsNullOrWhiteSpace(name))
            {
                query = query.Where(p => p.user.name.Contains(name));
            }

            if (clinicId.HasValue)
            {
                query = query.Where(p =>
                    p.Patient_Clinic_Registrations.Any(pc =>
                        pc.clinic_id == clinicId.Value));
            }

            if (lastVisit.HasValue)
            {
                query = query.Where(p =>
                    p.Patient_Clinic_Registrations.Any(pc =>
                        (!clinicId.HasValue || pc.clinic_id == clinicId.Value) &&
                        pc.last_visit.HasValue &&
                        pc.last_visit.Value.Date == lastVisit.Value.Date));
            }

            page = Math.Max(1, page);
            pageSize = Math.Max(1, pageSize);

            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            var patients = await query
                .OrderBy(p => p.patient_id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(r => new PatientListDto
                {
                    PatientId = r.patient_id,
                    UserId = r.user_id,
                    Name = r.user.name,
                    ContactNumber = r.user.contact_number,
                    CreatedAt = r.user.created_at,
                    Dob = r.dob,
                    BloodGroup = r.blood_group,
                    Weight = r.weight,
                    Gender = r.gender,
                    LastVisit = r.Patient_Clinic_Registrations
                        .Where(pc => !clinicId.HasValue || pc.clinic_id == clinicId.Value)
                        .Select(pc => pc.last_visit)
                        .FirstOrDefault()
                })
                .ToListAsync();

            return new PatientListResponseDto
            {
                Patients = patients,
                TotalCount = totalCount,
                TotalPages = totalPages
            };
        }
    }
}
