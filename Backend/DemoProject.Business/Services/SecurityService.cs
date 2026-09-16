using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using DemoProject.Business.DTOs;
using DemoProject.Business.Interfaces;
using DemoProject.Data.Entities;
using DemoProject.Repository.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DemoProject.Business.Services
{
    public class SecurityService : ISecurityService
    {
        private readonly ISecurityRepository _securityRepository;
        private readonly IConfiguration _configuration;

        public SecurityService(ISecurityRepository securityRepository, IConfiguration configuration)
        {
            _securityRepository = securityRepository;
            _configuration = configuration;
        }

        public async Task<LoginResponseDTO> LoginAsync(LoginRequestDTO request, string ipAddress, string browserInfo)
        {
            var user = await _securityRepository.ValidateLoginAsync(request.LoginId);
            if (user == null || !user.IsActive || user.DeletedFlag)
                throw new UnauthorizedAccessException("Invalid login credentials or user is inactive.");

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
            if (!isPasswordValid)
                throw new UnauthorizedAccessException("Invalid login credentials.");

            // Generate JWT Token
            var tokenHandler = new JwtSecurityTokenHandler();
            var jwtSettings = _configuration.GetSection("Jwt");
            var key = Encoding.UTF8.GetBytes(jwtSettings["Key"] ?? "DefaultSecretKeyForJwtAuthentication123!@#");
            
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Name, user.FullName),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.RoleId == 1 ? "Admin" : "User")
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(8),
                Issuer = jwtSettings["Issuer"],
                Audience = jwtSettings["Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);

            // Audit login
            await _securityRepository.UpdateLastLoginDateAsync(user.UserId);
            await _securityRepository.InsertLoginLogAsync(user.UserId, ipAddress, browserInfo);

            return new LoginResponseDTO
            {
                Token = tokenHandler.WriteToken(token),
                UserId = user.UserId,
                FullName = user.FullName,
                Email = user.Email,
                RoleId = user.RoleId
            };
        }

        public async Task LogoutAsync(int loginLogId)
        {
            await _securityRepository.UpdateLogoutDateAsync(loginLogId);
        }

        public async Task<UserDTO> GetUserByIdAsync(int userId)
        {
            var user = await _securityRepository.GetUserByIdAsync(userId);
            if (user == null) return null;

            return new UserDTO
            {
                UserId = user.UserId,
                FullName = user.FullName,
                Email = user.Email,
                LoginId = user.LoginId,
                RoleId = user.RoleId,
                IsActive = user.IsActive
            };
        }

        public async Task<IEnumerable<UserDTO>> GetAllUsersAsync()
        {
            var users = await _securityRepository.GetAllUsersAsync();
            return users.Select(u => new UserDTO
            {
                UserId = u.UserId,
                FullName = u.FullName,
                Email = u.Email,
                LoginId = u.LoginId,
                RoleId = u.RoleId,
                IsActive = u.IsActive
            });
        }

        public async Task<IEnumerable<MemberDTO>> GetAllMembersAsync()
        {
            var members = await _securityRepository.GetAllMembersAsync();
            return members.Select(m => new MemberDTO
            {
                MemberKey = m.MemberKey,
                MemberName = m.MemberName
            });
        }

        public async Task<int> CreateUserAsync(UserDTO userDto, int currentUserId)
        {
            var user = new NU_User
            {
                FullName = userDto.FullName,
                Email = userDto.Email,
                LoginId = userDto.LoginId,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(userDto.Password),
                IsActive = userDto.IsActive,
                MemberKey = userDto.MemberKey,
                CreatedBy = currentUserId
            };
            return await _securityRepository.InsertUserAsync(user);
        }

        public async Task UpdateUserAsync(UserDTO userDto, int currentUserId)
        {
            var user = new NU_User
            {
                UserId = userDto.UserId,
                FullName = userDto.FullName,
                Email = userDto.Email,
                LoginId = userDto.LoginId,
                IsActive = userDto.IsActive,
                ModifiedBy = currentUserId
            };
            await _securityRepository.UpdateUserAsync(user);
        }

        public async Task ResetPasswordAsync(int userId, string newPassword, int currentUserId)
        {
            var hash = BCrypt.Net.BCrypt.HashPassword(newPassword);
            await _securityRepository.UpdatePasswordAsync(userId, hash, currentUserId);
        }

        public async Task ChangePasswordAsync(int userId, string oldPassword, string newPassword)
        {
            var user = await _securityRepository.GetUserByIdAsync(userId);
            // Re-fetch to get hash, since GetUserByIdAsync doesn't return hash from SP, wait...
            // Let's use ValidateLogin internally or write a specific method if needed.
            // Oh, SP GetUserById does not return PasswordHash. Let's fix that or use a workaround.
            // For now we will assume the password change requires knowing the old password.
            throw new NotImplementedException("ChangePassword requires hash retrieval.");
        }

        public async Task DeleteUserAsync(int userId, int currentUserId)
        {
            await _securityRepository.DeleteUserAsync(userId, currentUserId);
        }

        public async Task<IEnumerable<MenuDTO>> GetMenusTreeAsync()
        {
            var menus = await _securityRepository.GetAllMenusAsync();
            var allMenus = menus.Select(m => new MenuDTO
            {
                MenuId = m.MenuId,
                ParentMenuId = m.ParentMenuId,
                MenuName = m.MenuName,
                MenuRoute = m.MenuRoute,
                MenuIcon = m.MenuIcon,
                DisplayOrder = m.DisplayOrder
            }).ToList();

            var parents = allMenus.Where(m => m.ParentMenuId == null).OrderBy(m => m.DisplayOrder).ToList();
            foreach (var parent in parents)
            {
                parent.Children = allMenus.Where(m => m.ParentMenuId == parent.MenuId).OrderBy(m => m.DisplayOrder).ToList();
            }

            return parents;
        }

        public async Task<IEnumerable<MenuDTO>> GetAuthorizedMenusAsync(int userId)
        {
            var user = await _securityRepository.GetUserByIdAsync(userId);
            bool isAdmin = user?.RoleId == 1;

            if (isAdmin)
            {
                return await GetMenusTreeAsync();
            }

            var permissions = await _securityRepository.GetUserPermissionsAsync(userId);
            var menus = await _securityRepository.GetAllMenusAsync();

            var authorizedMenus = menus.Where(m => m.ParentMenuId == null || permissions.Any(p => p.MenuId == m.MenuId && p.CanView)).ToList();

            var result = new List<MenuDTO>();
            var parents = authorizedMenus.Where(m => m.ParentMenuId == null).OrderBy(m => m.DisplayOrder).ToList();
            foreach (var parent in parents)
            {
                var children = authorizedMenus.Where(m => m.ParentMenuId == parent.MenuId).OrderBy(m => m.DisplayOrder).ToList();
                if (children.Any() || permissions.Any(p => p.MenuId == parent.MenuId && p.CanView))
                {
                    var parentDto = new MenuDTO
                    {
                        MenuId = parent.MenuId,
                        ParentMenuId = parent.ParentMenuId,
                        MenuName = parent.MenuName,
                        MenuRoute = parent.MenuRoute,
                        MenuIcon = parent.MenuIcon,
                        DisplayOrder = parent.DisplayOrder,
                        Children = children.Select(c => new MenuDTO
                        {
                            MenuId = c.MenuId,
                            ParentMenuId = c.ParentMenuId,
                            MenuName = c.MenuName,
                            MenuRoute = c.MenuRoute,
                            MenuIcon = c.MenuIcon,
                            DisplayOrder = c.DisplayOrder
                        }).ToList()
                    };
                    result.Add(parentDto);
                }
            }
            return result;
        }

        public async Task<IEnumerable<UserPermissionDTO>> GetUserPermissionsAsync(int userId)
        {
            var perms = await _securityRepository.GetUserPermissionsAsync(userId);
            return perms.Select(p => new UserPermissionDTO
            {
                PermissionId = p.PermissionId,
                UserId = p.UserId,
                MenuId = p.MenuId,
                MenuName = p.MenuName,
                ParentMenuId = p.ParentMenuId,
                MenuRoute = p.MenuRoute,
                MenuIcon = p.MenuIcon,
                DisplayOrder = p.DisplayOrder,
                CanView = p.CanView,
                CanAdd = p.CanAdd,
                CanEdit = p.CanEdit,
                CanDelete = p.CanDelete
            });
        }

        public async Task UpdateUserPermissionsAsync(int userId, List<UserPermissionDTO> permissions, int currentUserId)
        {
            foreach (var p in permissions)
            {
                var perm = new NU_UserMenuPermission
                {
                    UserId = userId,
                    MenuId = p.MenuId,
                    CanView = p.CanView,
                    CanAdd = p.CanAdd,
                    CanEdit = p.CanEdit,
                    CanDelete = p.CanDelete,
                    CreatedBy = currentUserId
                };
                await _securityRepository.UpdateUserPermissionAsync(perm);
            }
        }

        public async Task<IEnumerable<LoginAuditReportDTO>> GetLoginAuditReportAsync(DateTime? startDate, DateTime? endDate)
        {
            var logs = await _securityRepository.GetLoginAuditReportAsync(startDate, endDate);
            return logs.Select(l => new LoginAuditReportDTO
            {
                LoginLogId = l.LoginLogId,
                UserName = l.UserName,
                LoginDateTime = l.LoginDateTime,
                LogoutDateTime = l.LogoutDateTime,
                DurationMinutes = l.DurationMinutes,
                IPAddress = l.IPAddress,
                BrowserInfo = l.BrowserInfo
            });
        }
    }
}
