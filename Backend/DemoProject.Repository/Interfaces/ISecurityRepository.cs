using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DemoProject.Data.Entities;

namespace DemoProject.Repository.Interfaces
{
    public interface ISecurityRepository
    {
        Task<NU_User> ValidateLoginAsync(string loginId);
        Task UpdateLastLoginDateAsync(int userId);
        Task<int> InsertLoginLogAsync(int userId, string ipAddress, string browserInfo);
        Task UpdateLogoutDateAsync(int loginLogId);
        
        Task<NU_User> GetUserByIdAsync(int userId);
        Task<IEnumerable<NU_User>> GetAllUsersAsync();
        Task<IEnumerable<NU_MemberDetails>> GetAllMembersAsync();
        Task<int> InsertUserAsync(NU_User user);
        Task UpdateUserAsync(NU_User user);
        Task UpdatePasswordAsync(int userId, string passwordHash, int modifiedBy);
        Task DeleteUserAsync(int userId, int deletedBy);

        Task<IEnumerable<NU_Menu>> GetAllMenusAsync();
        Task<IEnumerable<NU_UserMenuPermission>> GetUserPermissionsAsync(int userId);
        Task UpdateUserPermissionAsync(NU_UserMenuPermission permission);

        Task<IEnumerable<NU_UserLoginLog>> GetLoginAuditReportAsync(DateTime? startDate, DateTime? endDate);
    }
}
