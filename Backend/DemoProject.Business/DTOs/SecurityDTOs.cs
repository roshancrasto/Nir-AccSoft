using System;
using System.Collections.Generic;

namespace DemoProject.Business.DTOs
{
    public class LoginRequestDTO
    {
        public string LoginId { get; set; }
        public string Password { get; set; }
    }

    public class LoginResponseDTO
    {
        public string Token { get; set; }
        public int UserId { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public int RoleId { get; set; }
    }

    public class UserDTO
    {
        public int UserId { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string LoginId { get; set; }
        public string? Password { get; set; } // Only used for creation/reset
        public int RoleId { get; set; }
        public bool IsActive { get; set; }
        public int? MemberKey { get; set; }
        public string? MemberName { get; set; }
    }

    public class UserPermissionDTO
    {
        public int PermissionId { get; set; }
        public int UserId { get; set; }
        public int MenuId { get; set; }
        public string MenuName { get; set; }
        public int? ParentMenuId { get; set; }
        public string MenuRoute { get; set; }
        public string MenuIcon { get; set; }
        public int DisplayOrder { get; set; }
        public bool CanView { get; set; }
        public bool CanAdd { get; set; }
        public bool CanEdit { get; set; }
        public bool CanDelete { get; set; }
    }

    public class MenuDTO
    {
        public int MenuId { get; set; }
        public int? ParentMenuId { get; set; }
        public string MenuName { get; set; }
        public string MenuRoute { get; set; }
        public string MenuIcon { get; set; }
        public int DisplayOrder { get; set; }
        
        public List<MenuDTO> Children { get; set; } = new List<MenuDTO>();
    }

    public class LoginAuditReportDTO
    {
        public int LoginLogId { get; set; }
        public string UserName { get; set; }
        public DateTime LoginDateTime { get; set; }
        public DateTime? LogoutDateTime { get; set; }
        public int DurationMinutes { get; set; }
        public string IPAddress { get; set; }
        public string BrowserInfo { get; set; }
    }

    public class ChangePasswordDTO
    {
        public int UserId { get; set; }
        public string NewPassword { get; set; }
    }

    public class MemberDTO
    {
        public int MemberKey { get; set; }
        public string MemberName { get; set; }
    }
}
