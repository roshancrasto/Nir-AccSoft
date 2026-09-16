-- Stored Procedures for Categories

CREATE OR ALTER PROCEDURE NU_sp_Category_Insert
    @CategoryName NVARCHAR(100),
    @CreatedBy INT
AS
BEGIN
    INSERT INTO NU_Categories (CategoryName, IsActive, CreatedBy, ModifiedDate)
    VALUES (@CategoryName, 1, @CreatedBy, GETDATE());
    
    SELECT SCOPE_IDENTITY() AS CategoryId;
END;
GO

CREATE OR ALTER PROCEDURE NU_sp_Category_Update
    @CategoryId INT,
    @CategoryName NVARCHAR(100),
    @IsActive BIT,
    @ModifiedBy INT
AS
BEGIN
    UPDATE NU_Categories
    SET CategoryName = @CategoryName,
        IsActive = @IsActive,
        ModifiedBy = @ModifiedBy,
        ModifiedDate = GETDATE()
    WHERE CategoryId = @CategoryId;
END;
GO

CREATE OR ALTER PROCEDURE NU_sp_Category_Delete
    @CategoryId INT,
    @ModifiedBy INT
AS
BEGIN
    UPDATE NU_Categories
    SET DeletedFlag = 1,
        ModifiedBy = @ModifiedBy,
        ModifiedDate = GETDATE()
    WHERE CategoryId = @CategoryId;
END;
GO

CREATE OR ALTER PROCEDURE NU_sp_Category_GetAll
AS
BEGIN
    SELECT CategoryId, CategoryName, IsActive
    FROM NU_Categories
    WHERE DeletedFlag = 0;
END;
GO
