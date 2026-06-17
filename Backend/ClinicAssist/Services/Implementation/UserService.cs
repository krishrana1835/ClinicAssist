using ClinicAssist.Data;
using ClinicAssist.Dtos.Users;

namespace ClinicAssist.Services.Implementation
{
    public class UserService
    {
        private readonly AppDbContext _context;

        public UserService(AppDbContext context)
        {
            _context = context;
        }
    }
}
