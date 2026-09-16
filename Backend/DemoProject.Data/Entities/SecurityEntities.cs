using System;

namespace DemoProject.Data.Entities
{
    public class NU_User
    {
        public int UserId { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string LoginId { get; set; }
        public string PasswordHash { get; set; }
        public int RoleId { get; set; }
        public bool IsActive { get; set; }
        public int? MemberKey { get; set; }
        public string MemberName { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public bool DeletedFlag { get; set; }
        public int? DeletedBy { get; set; }
    }

    public class NU_MemberDetails
    {
        public int MemberKey { get; set; }
        public string MemberName { get; set; }
    }

    public class NU_Menu
    {
        public int MenuId { get; set; }
        public int? ParentMenuId { get; set; }
        public string MenuName { get; set; }
        public string MenuRoute { get; set; }
        public string MenuIcon { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsActive { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public bool DeletedFlag { get; set; }
        public int? DeletedBy { get; set; }
        public DateTime? DeletedDate { get; set; }
    }

    public class NU_UserMenuPermission
    {
        public int PermissionId { get; set; }
        public int UserId { get; set; }
        public int MenuId { get; set; }
        public bool CanView { get; set; }
        public bool CanAdd { get; set; }
        public bool CanEdit { get; set; }
        public bool CanDelete { get; set; }
        
        // Joined fields
        public string MenuName { get; set; }
        public int? ParentMenuId { get; set; }
        public string MenuRoute { get; set; }
        public string MenuIcon { get; set; }
        public int DisplayOrder { get; set; }

        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public bool DeletedFlag { get; set; }
    }

    public class NU_UserLoginLog
    {
        public int LoginLogId { get; set; }
        public int UserId { get; set; }
        public DateTime LoginDateTime { get; set; }
        public DateTime? LogoutDateTime { get; set; }
        public string IPAddress { get; set; }
        public string BrowserInfo { get; set; }
        public DateTime? CreatedDate { get; set; }
        
        // Joined fields
        public string UserName { get; set; }
        public int DurationMinutes { get; set; }
    }
}
