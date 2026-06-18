using ClinicAssist.Data;
using ClinicAssist.Dtos.Users;
using Microsoft.EntityFrameworkCore;
using ClinicAssist.Exceptions;
using ClinicAssist.Services.Interface;

namespace ClinicAssist.Services.Implementation
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;

        public UserService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<UserResponse> GetUserByEmail(string email)
        {
            var user = await _context.Users
            .Where(u => u.email == email)
            .Select(u => new UserResponse
            {
                UserId = u.user_id,
                Name = u.name,
                Email = u.email,
                ContactNumber = u.contact_number,
                Role = u.role,
                CreatedAt = u.created_at
            })
            .FirstOrDefaultAsync();

            if (user == null)
                throw new NotFoundException("User not found");

            switch (user.Role)
            {
                case "Doctor":
                    user.RoleId = await _context.Doctors
                        .Where(d => d.user_id == user.UserId)
                        .Select(d => d.doctor_id)
                        .FirstOrDefaultAsync();
                    break;

                case "Patient":
                    user.RoleId = await _context.Patients
                        .Where(p => p.user_id == user.UserId)
                        .Select(p => p.patient_id)
                        .FirstOrDefaultAsync();
                    break;

                case "Assistant":
                    user.RoleId = await _context.Assistants
                        .Where(a => a.user_id == user.UserId)
                        .Select(a => a.assistant_id)
                        .FirstOrDefaultAsync();
                    break;
            }

            return user ?? throw new NotFoundException("User not found");
        }

        public async Task UpdatePasswordAsync(int userId, string password)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.user_id == userId);
            if (user == null)
                throw new NotFoundException("User does not exist");
            var hash_password = BCrypt.Net.BCrypt.HashPassword(password);
            user.password_hash = hash_password;
            await _context.SaveChangesAsync();
        }
    }
}