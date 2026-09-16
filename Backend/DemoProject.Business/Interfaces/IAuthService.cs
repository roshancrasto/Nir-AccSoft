using DemoProject.Business.DTOs;
using System.Threading.Tasks;

namespace DemoProject.Business.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto?> LoginAsync(LoginDto loginDto);
    }
}
