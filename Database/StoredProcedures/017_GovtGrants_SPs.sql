-- Create Government Grants Table and Stored Procedures

-- 1. Create Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[NU_GovtGrants]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[NU_GovtGrants] (
        [GovtGrantId]      INT IDENTITY(1,1) PRIMARY KEY,
        [GrantNumber]      NVARCHAR(50) NOT NULL,
        [EventGroupKey]    INT NOT NULL,
        [GrantDate]        DATE NOT NULL,
        [Amount]           DECIMAL(18,2) NOT NULL,
        [ConsiderForAudit] BIT NOT NULL DEFAULT 1,
        [Remarks]          NVARCHAR(500) NULL,
        [CreatedBy]        INT NULL,
        [CreatedDate]      DATETIME NOT NULL DEFAULT GETDATE(),
        [ModifiedBy]       INT NULL,
        [ModifiedDate]     DATETIME NULL,
        [DeletedFlag]      BIT NOT NULL DEFAULT 0,
        [IsActive]         BIT NOT NULL DEFAULT 1,
        CONSTRAINT [FK_NU_GovtGrants_NU_EventGroups] FOREIGN KEY ([EventGroupKey]) REFERENCES [dbo].[NU_EventGroups] ([EventGroupId])
    );
END;
GO

-- 2. Stored Procedure: INSERT
CREATE OR ALTER PROCEDURE [dbo].[NU_sp_GovtGrant_Insert]
    @EventGroupKey INT,
    @GrantDate DATE,
    @Amount DECIMAL(18,2),
    @ConsiderForAudit BIT,
    @Remarks NVARCHAR(500),
    @CreatedBy INT
 AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @Year INT = YEAR(@GrantDate);
    DECLARE @Prefix NVARCHAR(10) = 'GG-' + CAST(@Year AS NVARCHAR(4)) + '-';
    DECLARE @NextNumber INT;

    -- Use lock to avoid concurrent primary key or number duplicates
    SELECT @NextNumber = ISNULL(MAX(CAST(SUBSTRING(GrantNumber, 9, 4) AS INT)), 0) + 1
    FROM NU_GovtGrants WITH (UPDLOCK, HOLDLOCK)
    WHERE GrantNumber LIKE @Prefix + '%' AND DeletedFlag = 0;

    DECLARE @GrantNumber NVARCHAR(50) = @Prefix + RIGHT('0000' + CAST(@NextNumber AS NVARCHAR(4)), 4);

    INSERT INTO NU_GovtGrants (
        GrantNumber, EventGroupKey, GrantDate, Amount, ConsiderForAudit, Remarks, CreatedBy, CreatedDate, DeletedFlag, IsActive
    )
    VALUES (
        @GrantNumber, @EventGroupKey, @GrantDate, @Amount, @ConsiderForAudit, @Remarks, @CreatedBy, GETDATE(), 0, 1
    );

    SELECT SCOPE_IDENTITY() AS GovtGrantId;
END;
GO

-- 3. Stored Procedure: UPDATE
CREATE OR ALTER PROCEDURE [dbo].[NU_sp_GovtGrant_Update]
    @GovtGrantId INT,
    @EventGroupKey INT,
    @GrantDate DATE,
    @Amount DECIMAL(18,2),
    @ConsiderForAudit BIT,
    @Remarks NVARCHAR(500),
    @ModifiedBy INT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE NU_GovtGrants
    SET EventGroupKey = @EventGroupKey,
        GrantDate = @GrantDate,
        Amount = @Amount,
        ConsiderForAudit = @ConsiderForAudit,
        Remarks = @Remarks,
        ModifiedBy = @ModifiedBy,
        ModifiedDate = GETDATE()
    WHERE GovtGrantId = @GovtGrantId;
END;
GO

-- 4. Stored Procedure: DELETE
CREATE OR ALTER PROCEDURE [dbo].[NU_sp_GovtGrant_Delete]
    @GovtGrantId INT,
    @ModifiedBy INT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE NU_GovtGrants
    SET DeletedFlag = 1,
        ModifiedBy = @ModifiedBy,
        ModifiedDate = GETDATE()
    WHERE GovtGrantId = @GovtGrantId;
END;
GO

-- 5. Stored Procedure: GET ALL
CREATE OR ALTER PROCEDURE [dbo].[NU_sp_GovtGrant_GetAll]
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        GG.GovtGrantId,
        GG.GrantNumber,
        GG.EventGroupKey,
        EG.EventGroupName,
        GG.GrantDate,
        GG.Amount,
        GG.ConsiderForAudit,
        GG.Remarks
    FROM NU_GovtGrants GG
    LEFT JOIN NU_EventGroups EG ON GG.EventGroupKey = EG.EventGroupId
    WHERE GG.DeletedFlag = 0
    ORDER BY GG.GovtGrantId DESC;
END;
GO

-- 6. Stored Procedure: GET BY ID
CREATE OR ALTER PROCEDURE [dbo].[NU_sp_GovtGrant_GetById]
    @GovtGrantId INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        GG.GovtGrantId,
        GG.GrantNumber,
        GG.EventGroupKey,
        EG.EventGroupName,
        GG.GrantDate,
        GG.Amount,
        GG.ConsiderForAudit,
        GG.Remarks
    FROM NU_GovtGrants GG
    LEFT JOIN NU_EventGroups EG ON GG.EventGroupKey = EG.EventGroupId
    WHERE GG.GovtGrantId = @GovtGrantId AND GG.DeletedFlag = 0;
END;
GO
