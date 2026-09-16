-- Stored Procedures for Authentication / Users

CREATE OR ALTER PROCEDURE NU_sp_User_GetByEmail
    @Email NVARCHAR(100)
AS
BEGIN
    SELECT u.UserId, u.FullName, u.Email, u.PasswordHash, u.RoleId, r.RoleName, u.IsActive
    FROM NU_Users u
    INNER JOIN NU_Roles r ON u.RoleId = r.RoleId
    WHERE u.Email = @Email AND u.DeletedFlag = 0;
END;
GO

CREATE OR ALTER PROCEDURE NU_sp_User_Insert
    @FullName NVARCHAR(100),
    @Email NVARCHAR(100),
    @PasswordHash NVARCHAR(MAX),
    @RoleId INT,
    @CreatedBy INT
AS
BEGIN
    INSERT INTO NU_Users (FullName, Email, PasswordHash, RoleId, IsActive, CreatedBy, ModifiedDate)
    VALUES (@FullName, @Email, @PasswordHash, @RoleId, 1, @CreatedBy, GETDATE());
    
    SELECT SCOPE_IDENTITY() AS UserId;
END;
GO
