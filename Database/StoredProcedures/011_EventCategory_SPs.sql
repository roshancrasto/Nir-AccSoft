-- Stored Procedures for Event Category Master

CREATE OR ALTER PROCEDURE NU_sp_EventCategory_Insert
    @EventCatName VARCHAR(50),
    @CreatedBy INT
AS
BEGIN
    INSERT INTO NU_EventCategoryMaster (EventCatName, IsActive, CreatedBy, CreatedDate, ModifiedDate)
    VALUES (@EventCatName, 1, @CreatedBy, GETDATE(), GETDATE());
    
    SELECT SCOPE_IDENTITY() AS EventCatKey;
END;
GO

CREATE OR ALTER PROCEDURE NU_sp_EventCategory_Update
    @EventCatKey INT,
    @EventCatName VARCHAR(50),
    @IsActive BIT,
    @ModifiedBy INT
AS
BEGIN
    UPDATE NU_EventCategoryMaster
    SET EventCatName = @EventCatName,
        IsActive = @IsActive,
        ModifiedBy = @ModifiedBy,
        ModifiedDate = GETDATE()
    WHERE EventCatKey = @EventCatKey;
END;
GO

CREATE OR ALTER PROCEDURE NU_sp_EventCategory_Delete
    @EventCatKey INT,
    @ModifiedBy INT
AS
BEGIN
    UPDATE NU_EventCategoryMaster
    SET DeletedFlag = 1,
        ModifiedBy = @ModifiedBy,
        ModifiedDate = GETDATE()
    WHERE EventCatKey = @EventCatKey;
END;
GO

CREATE OR ALTER PROCEDURE NU_sp_EventCategory_GetAll
AS
BEGIN
    SELECT EventCatKey, EventCatName, IsActive
    FROM NU_EventCategoryMaster
    WHERE DeletedFlag = 0;
END;
GO
