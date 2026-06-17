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
            var user = await _context.Users.Select(u => new UserResponse
            {
                UserId = u.user_id,
                Name = u.name,
                Email = u.email,
                ContactNumber = u.contact_number,
                Role = u.role,
                CreatedAt = u.created_at,
            }).FirstOrDefaultAsync(u => u.Email == email);

            if(user == null) { throw new NotFoundException("User not found"); }
            return user;
        }
    }
}