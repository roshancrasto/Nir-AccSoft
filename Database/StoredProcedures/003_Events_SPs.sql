-- Stored Procedures for Event Groups

CREATE OR ALTER PROCEDURE NU_sp_EventGroup_Insert
    @EventGroupName NVARCHAR(200),
    @StartDate DATE,
    @EndDate DATE,
    @BudgetAmount DECIMAL(18,2),
    @Description NVARCHAR(MAX),
    @Status NVARCHAR(50),
    @CreatedBy INT
AS
BEGIN
    INSERT INTO NU_EventGroups (EventGroupName, StartDate, EndDate, BudgetAmount, Description, Status, IsActive, CreatedBy, ModifiedDate)
    VALUES (@EventGroupName, @StartDate, @EndDate, @BudgetAmount, @Description, @Status, 1, @CreatedBy, GETDATE());
    
    SELECT SCOPE_IDENTITY() AS EventGroupId;
END;
GO

CREATE OR ALTER PROCEDURE NU_sp_EventGroup_Update
    @EventGroupId INT,
    @EventGroupName NVARCHAR(200),
    @StartDate DATE,
    @EndDate DATE,
    @BudgetAmount DECIMAL(18,2),
    @Description NVARCHAR(MAX),
    @Status NVARCHAR(50),
    @IsActive BIT,
    @ModifiedBy INT
AS
BEGIN
    UPDATE NU_EventGroups
    SET EventGroupName = @EventGroupName,
        StartDate = @StartDate,
        EndDate = @EndDate,
        BudgetAmount = @BudgetAmount,
        Description = @Description,
        Status = @Status,
        IsActive = @IsActive,
        ModifiedBy = @ModifiedBy,
        ModifiedDate = GETDATE()
    WHERE EventGroupId = @EventGroupId;
END;
GO

CREATE OR ALTER PROCEDURE NU_sp_EventGroup_Delete
    @EventGroupId INT,
    @ModifiedBy INT
AS
BEGIN
    UPDATE NU_EventGroups
    SET DeletedFlag = 1,
        ModifiedBy = @ModifiedBy,
        ModifiedDate = GETDATE()
    WHERE EventGroupId = @EventGroupId;
END;
GO

CREATE OR ALTER PROCEDURE NU_sp_EventGroup_GetAll
AS
BEGIN
    SELECT EventGroupId, EventGroupName, StartDate, EndDate, BudgetAmount, Description, Status, IsActive
    FROM NU_EventGroups
    WHERE DeletedFlag = 0;
END;
GO
