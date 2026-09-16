-- Stored Procedures for Event Details

CREATE OR ALTER PROCEDURE NU_sp_EventDetail_Insert
    @EventCategoryKey INT,
    @EventGroupKey INT,
    @LanguageKey INT,
    @EventName VARCHAR(100),
    @EventDate DATETIME,
    @CreatedBy INT
AS
BEGIN
    INSERT INTO NU_EventDetails (EventCategoryKey, EventGroupKey, LanguageKey, EventName, EventDate, IsActive, CreatedBy, CreatedDate, ModifiedDate)
    VALUES (@EventCategoryKey, @EventGroupKey, @LanguageKey, @EventName, @EventDate, 1, @CreatedBy, GETDATE(), GETDATE());
    
    SELECT SCOPE_IDENTITY() AS EventKey;
END;
GO

CREATE OR ALTER PROCEDURE NU_sp_EventDetail_Update
    @EventKey INT,
    @EventCategoryKey INT,
    @EventGroupKey INT,
    @LanguageKey INT,
    @EventName VARCHAR(100),
    @EventDate DATETIME,
    @IsActive BIT,
    @ModifiedBy INT
AS
BEGIN
    UPDATE NU_EventDetails
    SET EventCategoryKey = @EventCategoryKey,
        EventGroupKey = @EventGroupKey,
        LanguageKey = @LanguageKey,
        EventName = @EventName,
        EventDate = @EventDate,
        IsActive = @IsActive,
        ModifiedBy = @ModifiedBy,
        ModifiedDate = GETDATE()
    WHERE EventKey = @EventKey;
END;
GO

CREATE OR ALTER PROCEDURE NU_sp_EventDetail_Delete
    @EventKey INT,
    @ModifiedBy INT
AS
BEGIN
    UPDATE NU_EventDetails
    SET DeletedFlag = 1,
        ModifiedBy = @ModifiedBy,
        ModifiedDate = GETDATE()
    WHERE EventKey = @EventKey;
END;
GO

CREATE OR ALTER PROCEDURE NU_sp_EventDetail_GetAll
AS
BEGIN
    SELECT 
        ed.EventKey, 
        ed.EventCategoryKey, 
        ec.EventCatName AS EventCategoryName,
        ed.EventGroupKey, 
        eg.EventGroupName,
        ed.LanguageKey, 
        lm.LangName AS LanguageName,
        ed.EventName, 
        ed.EventDate, 
        ed.IsActive
    FROM NU_EventDetails ed
    LEFT JOIN NU_EventCategoryMaster ec ON ed.EventCategoryKey = ec.EventCatKey
    LEFT JOIN NU_EventGroups eg ON ed.EventGroupKey = eg.EventGroupId
    LEFT JOIN NU_LanguageMaster lm ON ed.LanguageKey = lm.LangKey
    WHERE ed.DeletedFlag = 0;
END;
GO
