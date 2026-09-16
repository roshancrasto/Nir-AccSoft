using System.Collections.Generic;
using System.Threading.Tasks;
using DemoProject.Business.DTOs;
using DemoProject.Data.Entities;

namespace DemoProject.Business.Interfaces
{
    public interface ISecurityService
    {
        Task<LoginResponseDTO> LoginAsync(LoginRequestDTO request, string ipAddress, string browserInfo);
        Task LogoutAsync(int loginLogId);
        
        Task<UserDTO> GetUserByIdAsync(int userId);
        Task<IEnumerable<UserDTO>> GetAllUsersAsync();
        Task<IEnumerable<MemberDTO>> GetAllMembersAsync();
        Task<int> CreateUserAsync(UserDTO userDto, int currentUserId);
        Task UpdateUserAsync(UserDTO userDto, int currentUserId);
        Task ResetPasswordAsync(int userId, string newPassword, int currentUserId);
        Task ChangePasswordAsync(int userId, string oldPassword, string newPassword);
        Task DeleteUserAsync(int userId, int currentUserId);

        Task<IEnumerable<MenuDTO>> GetMenusTreeAsync();
        Task<IEnumerable<MenuDTO>> GetAuthorizedMenusAsync(int userId);
        Task<IEnumerable<UserPermissionDTO>> GetUserPermissionsAsync(int userId);
        Task UpdateUserPermissionsAsync(int userId, List<UserPermissionDTO> permissions, int currentUserId);

        Task<IEnumerable<LoginAuditReportDTO>> GetLoginAuditReportAsync(System.DateTime? startDate, System.DateTime? endDate);
    }
}
