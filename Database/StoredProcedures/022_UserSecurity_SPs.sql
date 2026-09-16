-- Stored Procedures for User Security

-- 1. Validate Login
CREATE OR ALTER PROCEDURE sp_ValidateLogin
    @LoginId NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        UserId,
        FullName,
        Email,
        PasswordHash,
        RoleId,
        IsActive,
        DeletedFlag
    FROM NU_Users
    WHERE LoginId = @LoginId;
END
GO

-- 2. Update Last Login Date
CREATE OR ALTER PROCEDURE sp_UpdateLastLoginDate
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE NU_Users
    SET LastLoginDate = GETDATE()
    WHERE UserId = @UserId;
END
GO

-- 3. Insert Login Log
CREATE OR ALTER PROCEDURE sp_InsertLoginLog
    @UserId INT,
    @IPAddress NVARCHAR(100),
    @BrowserInfo NVARCHAR(500)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO NU_UserLoginLogs (UserId, LoginDateTime, IPAddress, BrowserInfo, CreatedDate)
    VALUES (@UserId, GETDATE(), @IPAddress, @BrowserInfo, GETDATE());

    SELECT SCOPE_IDENTITY() AS LoginLogId;
END
GO

-- 4. Update Logout Date
CREATE OR ALTER PROCEDURE sp_UpdateLogoutDate
    @LoginLogId INT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE NU_UserLoginLogs
    SET LogoutDateTime = GETDATE()
    WHERE LoginLogId = @LoginLogId;
END
GO

-- 5. Get User By Id
CREATE OR ALTER PROCEDURE sp_GetUserById
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        u.UserId, u.FullName, u.Email, u.LoginId, u.RoleId, u.IsActive, u.MemberKey, m.MemberName
    FROM NU_Users u
    LEFT JOIN NU_MemberDetails m ON u.MemberKey = m.MemberKey
    WHERE u.UserId = @UserId AND u.DeletedFlag = 0;
END
GO

-- 6. Get All Users
CREATE OR ALTER PROCEDURE sp_GetAllUsers
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        u.UserId, u.FullName, u.Email, u.LoginId, u.RoleId, u.IsActive, u.CreatedDate, u.MemberKey, m.MemberName
    FROM NU_Users u
    LEFT JOIN NU_MemberDetails m ON u.MemberKey = m.MemberKey
    WHERE u.DeletedFlag = 0;
END
GO

-- 7. Insert User
CREATE OR ALTER PROCEDURE sp_InsertUser
    @FullName NVARCHAR(100),
    @Email NVARCHAR(100),
    @LoginId NVARCHAR(50),
    @PasswordHash NVARCHAR(MAX),
    @IsActive BIT,
    @MemberKey INT = NULL,
    @CreatedBy INT
AS
BEGIN
    SET NOCOUNT ON;
    
    IF EXISTS(SELECT 1 FROM NU_Users WHERE LoginId = @LoginId)
    BEGIN
        RAISERROR('Login ID already exists', 16, 1);
        RETURN;
    END

    -- Set RoleId to 0 for all new users as requested
    DECLARE @UserRoleId INT = 0;

    INSERT INTO NU_Users (FullName, Email, LoginId, PasswordHash, RoleId, IsActive, MemberKey, CreatedBy, CreatedDate, DeletedFlag)
    VALUES (@FullName, @Email, @LoginId, @PasswordHash, @UserRoleId, @IsActive, @MemberKey, @CreatedBy, GETDATE(), 0);

    SELECT SCOPE_IDENTITY() AS UserId;
END
GO

-- 8. Update User
CREATE OR ALTER PROCEDURE sp_UpdateUser
    @UserId INT,
    @FullName NVARCHAR(100),
    @Email NVARCHAR(100),
    @LoginId NVARCHAR(50),
    @IsActive BIT,
    @ModifiedBy INT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE NU_Users
    SET FullName = @FullName,
        Email = @Email,
        LoginId = @LoginId,
        IsActive = @IsActive,
        ModifiedBy = @ModifiedBy,
        ModifiedDate = GETDATE()
    WHERE UserId = @UserId;
END
GO

-- 9. Update Password
CREATE OR ALTER PROCEDURE sp_UpdatePassword
    @UserId INT,
    @PasswordHash NVARCHAR(MAX),
    @ModifiedBy INT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE NU_Users
    SET PasswordHash = @PasswordHash,
        ModifiedBy = @ModifiedBy,
        ModifiedDate = GETDATE()
    WHERE UserId = @UserId;
END
GO

-- 10. Delete User (Soft Delete)
CREATE OR ALTER PROCEDURE sp_DeleteUser
    @UserId INT,
    @DeletedBy INT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE NU_Users
    SET DeletedFlag = 1,
        DeletedBy = @DeletedBy,
        DeletedDate = GETDATE()
    WHERE UserId = @UserId;
END
GO

-- 11. Get All Menus
CREATE OR ALTER PROCEDURE sp_GetAllMenus
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        MenuId, ParentMenuId, MenuName, MenuRoute, MenuIcon, DisplayOrder, IsActive
    FROM NU_Menus
    WHERE DeletedFlag = 0 AND IsActive = 1
    ORDER BY ParentMenuId, DisplayOrder;
END
GO

-- 12. Get User Permissions
CREATE OR ALTER PROCEDURE sp_GetUserPermissions
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        p.PermissionId, p.UserId, m.MenuId, m.MenuName, m.ParentMenuId, m.DisplayOrder, m.MenuRoute, m.MenuIcon,
        ISNULL(p.CanView, 0) AS CanView,
        ISNULL(p.CanAdd, 0) AS CanAdd,
        ISNULL(p.CanEdit, 0) AS CanEdit,
        ISNULL(p.CanDelete, 0) AS CanDelete
    FROM NU_Menus m
    LEFT JOIN NU_UserMenuPermissions p ON m.MenuId = p.MenuId AND p.UserId = @UserId AND p.DeletedFlag = 0
    WHERE m.DeletedFlag = 0 AND m.IsActive = 1
    ORDER BY m.ParentMenuId, m.DisplayOrder;
END
GO

-- 13. Update User Permission
CREATE OR ALTER PROCEDURE sp_UpdateUserPermission
    @UserId INT,
    @MenuId INT,
    @CanView BIT,
    @CanAdd BIT,
    @CanEdit BIT,
    @CanDelete BIT,
    @CreatedBy INT
AS
BEGIN
    SET NOCOUNT ON;
    
    IF EXISTS (SELECT 1 FROM NU_UserMenuPermissions WHERE UserId = @UserId AND MenuId = @MenuId AND DeletedFlag = 0)
    BEGIN
        UPDATE NU_UserMenuPermissions
        SET CanView = @CanView,
            CanAdd = @CanAdd,
            CanEdit = @CanEdit,
            CanDelete = @CanDelete,
            ModifiedBy = @CreatedBy,
            ModifiedDate = GETDATE()
        WHERE UserId = @UserId AND MenuId = @MenuId AND DeletedFlag = 0;
    END
    ELSE
    BEGIN
        INSERT INTO NU_UserMenuPermissions (UserId, MenuId, CanView, CanAdd, CanEdit, CanDelete, CreatedBy, CreatedDate)
        VALUES (@UserId, @MenuId, @CanView, @CanAdd, @CanEdit, @CanDelete, @CreatedBy, GETDATE());
    END
END
GO

-- 14. Get Login Audit Report
CREATE OR ALTER PROCEDURE sp_GetLoginAuditReport
    @StartDate DATETIME = NULL,
    @EndDate DATETIME = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        l.LoginLogId,
        u.FullName AS UserName,
        l.LoginDateTime,
        l.LogoutDateTime,
        DATEDIFF(MINUTE, l.LoginDateTime, ISNULL(l.LogoutDateTime, GETDATE())) AS DurationMinutes,
        l.IPAddress,
        l.BrowserInfo
    FROM NU_UserLoginLogs l
    INNER JOIN NU_Users u ON l.UserId = u.UserId
    WHERE (@StartDate IS NULL OR l.LoginDateTime >= @StartDate)
      AND (@EndDate IS NULL OR l.LoginDateTime <= @EndDate)
    ORDER BY l.LoginDateTime DESC;
END
GO
