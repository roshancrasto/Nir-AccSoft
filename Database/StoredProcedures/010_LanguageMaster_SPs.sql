-- Stored Procedures for Language Master

CREATE OR ALTER PROCEDURE NU_sp_LanguageMaster_Insert
    @LangName VARCHAR(20),
    @CreatedBy INT
AS
BEGIN
    INSERT INTO NU_LanguageMaster (LangName, IsActive, CreatedBy, CreatedDate, ModifiedDate)
    VALUES (@LangName, 1, @CreatedBy, GETDATE(), GETDATE());
    
    SELECT SCOPE_IDENTITY() AS LangKey;
END;
GO

CREATE OR ALTER PROCEDURE NU_sp_LanguageMaster_Update
    @LangKey INT,
    @LangName VARCHAR(20),
    @IsActive BIT,
    @ModifiedBy INT
AS
BEGIN
    UPDATE NU_LanguageMaster
    SET LangName = @LangName,
        IsActive = @IsActive,
        ModifiedBy = @ModifiedBy,
        ModifiedDate = GETDATE()
    WHERE LangKey = @LangKey;
END;
GO

CREATE OR ALTER PROCEDURE NU_sp_LanguageMaster_Delete
    @LangKey INT,
    @ModifiedBy INT
AS
BEGIN
    UPDATE NU_LanguageMaster
    SET DeletedFlag = 1,
        ModifiedBy = @ModifiedBy,
        ModifiedDate = GETDATE()
    WHERE LangKey = @LangKey;
END;
GO

CREATE OR ALTER PROCEDURE NU_sp_LanguageMaster_GetAll
AS
BEGIN
    SELECT LangKey, LangName, IsActive
    FROM NU_LanguageMaster
    WHERE DeletedFlag = 0;
END;
GO
