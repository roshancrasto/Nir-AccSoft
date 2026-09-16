using Microsoft.AspNetCore.Mvc;
using DemoProject.Business.DTOs;
using DemoProject.Business.Interfaces;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System;

namespace DemoProject.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SecurityController : ControllerBase
    {
        private readonly ISecurityService _securityService;

        public SecurityController(ISecurityService securityService)
        {
            _securityService = securityService;
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            return userIdClaim != null ? int.Parse(userIdClaim.Value) : 0;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRequestDTO request)
        {
            try
            {
                var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown IP";
                var browserInfo = Request.Headers["User-Agent"].ToString();

                var response = await _securityService.LoginAsync(request, ipAddress, browserInfo);
                return Ok(response);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout([FromBody] int loginLogId)
        {
            await _securityService.LogoutAsync(loginLogId);
            return Ok();
        }

        [HttpGet("users")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetUsers()
        {
            var users = await _securityService.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpGet("users/members")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<MemberDTO>>> GetMembers()
        {
            var members = await _securityService.GetAllMembersAsync();
            return Ok(members);
        }

        [HttpPost("users")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateUser([FromBody] UserDTO userDto)
        {
            var userId = await _securityService.CreateUserAsync(userDto, GetCurrentUserId());
            return Ok(new { UserId = userId });
        }

        [HttpPut("users/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UserDTO userDto)
        {
            userDto.UserId = id;
            await _securityService.UpdateUserAsync(userDto, GetCurrentUserId());
            return Ok();
        }

        [HttpPost("users/{id}/reset-password")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ResetPassword(int id, [FromBody] string newPassword)
        {
            await _securityService.ResetPasswordAsync(id, newPassword, GetCurrentUserId());
            return Ok();
        }

        [HttpGet("menus")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<MenuDTO>>> GetAuthorizedMenus()
        {
            var menus = await _securityService.GetAuthorizedMenusAsync(GetCurrentUserId());
            return Ok(menus);
        }

        [HttpGet("my-permissions")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<UserPermissionDTO>>> GetMyPermissions()
        {
            var permissions = await _securityService.GetUserPermissionsAsync(GetCurrentUserId());
            return Ok(permissions);
        }

        [HttpGet("permissions/{userId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<UserPermissionDTO>>> GetUserPermissions(int userId)
        {
            var permissions = await _securityService.GetUserPermissionsAsync(userId);
            return Ok(permissions);
        }

        [HttpPost("permissions/{userId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateUserPermissions(int userId, [FromBody] List<UserPermissionDTO> permissions)
        {
            await _securityService.UpdateUserPermissionsAsync(userId, permissions, GetCurrentUserId());
            return Ok();
        }

        [HttpGet("audit")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<LoginAuditReportDTO>>> GetLoginAuditReport([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            var report = await _securityService.GetLoginAuditReportAsync(startDate, endDate);
            return Ok(report);
        }
    }
}
