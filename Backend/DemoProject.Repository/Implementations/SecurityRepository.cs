using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Dapper;
using DemoProject.Data.Entities;
using DemoProject.Repository.Interfaces;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace DemoProject.Repository.Implementations
{
    public class SecurityRepository : ISecurityRepository
    {
        private readonly IConfiguration _configuration;
        private readonly string _connectionString;

        public SecurityRepository(IConfiguration configuration)
        {
            _configuration = configuration;
            _connectionString = _configuration.GetConnectionString("AccSoftConnection");
        }

        private IDbConnection CreateConnection()
        {
            Console.WriteLine($"ConnStr: {_connectionString}");
            return new SqlConnection(_connectionString);
        }

        public async Task<NU_User> ValidateLoginAsync(string loginId)
        {
            using var connection = CreateConnection();
            return await connection.QuerySingleOrDefaultAsync<NU_User>(
                "sp_ValidateLogin", 
                new { LoginId = loginId }, 
                commandType: CommandType.StoredProcedure);
        }

        public async Task UpdateLastLoginDateAsync(int userId)
        {
            using var connection = CreateConnection();
            await connection.ExecuteAsync(
                "sp_UpdateLastLoginDate", 
                new { UserId = userId }, 
                commandType: CommandType.StoredProcedure);
        }

        public async Task<int> InsertLoginLogAsync(int userId, string ipAddress, string browserInfo)
        {
            using var connection = CreateConnection();
            return await connection.ExecuteScalarAsync<int>(
                "sp_InsertLoginLog", 
                new { UserId = userId, IPAddress = ipAddress, BrowserInfo = browserInfo }, 
                commandType: CommandType.StoredProcedure);
        }

        public async Task UpdateLogoutDateAsync(int loginLogId)
        {
            using var connection = CreateConnection();
            await connection.ExecuteAsync(
                "sp_UpdateLogoutDate", 
                new { LoginLogId = loginLogId }, 
                commandType: CommandType.StoredProcedure);
        }

        public async Task<NU_User> GetUserByIdAsync(int userId)
        {
            using var connection = CreateConnection();
            return await connection.QuerySingleOrDefaultAsync<NU_User>(
                "sp_GetUserById", 
                new { UserId = userId }, 
                commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<NU_User>> GetAllUsersAsync()
        {
            using var connection = CreateConnection();
            return await connection.QueryAsync<NU_User>(
                "sp_GetAllUsers", 
                commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<NU_MemberDetails>> GetAllMembersAsync()
        {
            using var connection = CreateConnection();
            return await connection.QueryAsync<NU_MemberDetails>(
                "SELECT MemberKey, MemberName FROM NU_MemberDetails ORDER BY MemberName", 
                commandType: CommandType.Text);
        }

        public async Task<int> InsertUserAsync(NU_User user)
        {
            using var connection = CreateConnection();
            return await connection.ExecuteScalarAsync<int>(
                "sp_InsertUser", 
                new { 
                    FullName = user.FullName, 
                    Email = user.Email, 
                    LoginId = user.LoginId, 
                    PasswordHash = user.PasswordHash, 
                    IsActive = user.IsActive, 
                    MemberKey = user.MemberKey,
                    CreatedBy = user.CreatedBy 
                }, 
                commandType: CommandType.StoredProcedure);
        }

        public async Task UpdateUserAsync(NU_User user)
        {
            using var connection = CreateConnection();
            await connection.ExecuteAsync(
                "sp_UpdateUser", 
                new { 
                    UserId = user.UserId,
                    FullName = user.FullName, 
                    Email = user.Email, 
                    LoginId = user.LoginId, 
                    IsActive = user.IsActive, 
                    ModifiedBy = user.ModifiedBy 
                }, 
                commandType: CommandType.StoredProcedure);
        }

        public async Task UpdatePasswordAsync(int userId, string passwordHash, int modifiedBy)
        {
            using var connection = CreateConnection();
            await connection.ExecuteAsync(
                "sp_UpdatePassword", 
                new { UserId = userId, PasswordHash = passwordHash, ModifiedBy = modifiedBy }, 
                commandType: CommandType.StoredProcedure);
        }

        public async Task DeleteUserAsync(int userId, int deletedBy)
        {
            using var connection = CreateConnection();
            await connection.ExecuteAsync(
                "sp_DeleteUser", 
                new { UserId = userId, DeletedBy = deletedBy }, 
                commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<NU_Menu>> GetAllMenusAsync()
        {
            using var connection = CreateConnection();
            return await connection.QueryAsync<NU_Menu>(
                "sp_GetAllMenus", 
                commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<NU_UserMenuPermission>> GetUserPermissionsAsync(int userId)
        {
            using var connection = CreateConnection();
            return await connection.QueryAsync<NU_UserMenuPermission>(
                "sp_GetUserPermissions", 
                new { UserId = userId }, 
                commandType: CommandType.StoredProcedure);
        }

        public async Task UpdateUserPermissionAsync(NU_UserMenuPermission permission)
        {
            using var connection = CreateConnection();
            await connection.ExecuteAsync(
                "sp_UpdateUserPermission", 
                new { 
                    UserId = permission.UserId, 
                    MenuId = permission.MenuId, 
                    CanView = permission.CanView, 
                    CanAdd = permission.CanAdd, 
                    CanEdit = permission.CanEdit, 
                    CanDelete = permission.CanDelete, 
                    CreatedBy = permission.CreatedBy 
                }, 
                commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<NU_UserLoginLog>> GetLoginAuditReportAsync(DateTime? startDate, DateTime? endDate)
        {
            using var connection = CreateConnection();
            return await connection.QueryAsync<NU_UserLoginLog>(
                "sp_GetLoginAuditReport", 
                new { StartDate = startDate, EndDate = endDate }, 
                commandType: CommandType.StoredProcedure);
        }
    }
}
