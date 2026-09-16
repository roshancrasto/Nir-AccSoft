using DemoProject.Data.Entities;
using System.Threading.Tasks;

namespace DemoProject.Repository.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetUserByEmailAsync(string email);
        Task<int> CreateUserAsync(User user);
    }
}
