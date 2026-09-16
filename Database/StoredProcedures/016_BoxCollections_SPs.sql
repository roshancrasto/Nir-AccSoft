-- Create Box Collections Table and Stored Procedures

-- 1. Create Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[NU_BoxCollections]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[NU_BoxCollections] (
        [BoxCollectionId]  INT IDENTITY(1,1) PRIMARY KEY,
        [CollectionNumber] NVARCHAR(50) NOT NULL,
        [EventGroupKey]    INT NOT NULL,
        [CollectionDate]   DATE NOT NULL,
        [Amount]           DECIMAL(18,2) NOT NULL,
        [ConsiderForAudit] BIT NOT NULL DEFAULT 1,
        [Remarks]          NVARCHAR(500) NULL,
        [CreatedBy]        INT NULL,
        [CreatedDate]      DATETIME NOT NULL DEFAULT GETDATE(),
        [ModifiedBy]       INT NULL,
        [ModifiedDate]     DATETIME NULL,
        [DeletedFlag]      BIT NOT NULL DEFAULT 0,
        [IsActive]         BIT NOT NULL DEFAULT 1,
        CONSTRAINT [FK_NU_BoxCollections_NU_EventGroups] FOREIGN KEY ([EventGroupKey]) REFERENCES [dbo].[NU_EventGroups] ([EventGroupId])
    );
END;
GO

-- 2. Stored Procedure: INSERT
CREATE OR ALTER PROCEDURE [dbo].[NU_sp_BoxCollection_Insert]
    @EventGroupKey INT,
    @CollectionDate DATE,
    @Amount DECIMAL(18,2),
    @ConsiderForAudit BIT,
    @Remarks NVARCHAR(500),
    @CreatedBy INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @Year INT = YEAR(@CollectionDate);
    DECLARE @Prefix NVARCHAR(10) = 'BC-' + CAST(@Year AS NVARCHAR(4)) + '-';
    DECLARE @NextNumber INT;

    -- Use lock to avoid concurrent primary key or number duplicates
    SELECT @NextNumber = ISNULL(MAX(CAST(SUBSTRING(CollectionNumber, 9, 4) AS INT)), 0) + 1
    FROM NU_BoxCollections WITH (UPDLOCK, HOLDLOCK)
    WHERE CollectionNumber LIKE @Prefix + '%' AND DeletedFlag = 0;

    DECLARE @CollectionNumber NVARCHAR(50) = @Prefix + RIGHT('0000' + CAST(@NextNumber AS NVARCHAR(4)), 4);

    INSERT INTO NU_BoxCollections (
        CollectionNumber, EventGroupKey, CollectionDate, Amount, ConsiderForAudit, Remarks, CreatedBy, CreatedDate, DeletedFlag, IsActive
    )
    VALUES (
        @CollectionNumber, @EventGroupKey, @CollectionDate, @Amount, @ConsiderForAudit, @Remarks, @CreatedBy, GETDATE(), 0, 1
    );

    SELECT SCOPE_IDENTITY() AS BoxCollectionId;
END;
GO

-- 3. Stored Procedure: UPDATE
CREATE OR ALTER PROCEDURE [dbo].[NU_sp_BoxCollection_Update]
    @BoxCollectionId INT,
    @EventGroupKey INT,
    @CollectionDate DATE,
    @Amount DECIMAL(18,2),
    @ConsiderForAudit BIT,
    @Remarks NVARCHAR(500),
    @ModifiedBy INT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE NU_BoxCollections
    SET EventGroupKey = @EventGroupKey,
        CollectionDate = @CollectionDate,
        Amount = @Amount,
        ConsiderForAudit = @ConsiderForAudit,
        Remarks = @Remarks,
        ModifiedBy = @ModifiedBy,
        ModifiedDate = GETDATE()
    WHERE BoxCollectionId = @BoxCollectionId;
END;
GO

-- 4. Stored Procedure: DELETE
CREATE OR ALTER PROCEDURE [dbo].[NU_sp_BoxCollection_Delete]
    @BoxCollectionId INT,
    @ModifiedBy INT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE NU_BoxCollections
    SET DeletedFlag = 1,
        ModifiedBy = @ModifiedBy,
        ModifiedDate = GETDATE()
    WHERE BoxCollectionId = @BoxCollectionId;
END;
GO

-- 5. Stored Procedure: GET ALL
CREATE OR ALTER PROCEDURE [dbo].[NU_sp_BoxCollection_GetAll]
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        BC.BoxCollectionId,
        BC.CollectionNumber,
        BC.EventGroupKey,
        EG.EventGroupName,
        BC.CollectionDate,
        BC.Amount,
        BC.ConsiderForAudit,
        BC.Remarks
    FROM NU_BoxCollections BC
    LEFT JOIN NU_EventGroups EG ON BC.EventGroupKey = EG.EventGroupId
    WHERE BC.DeletedFlag = 0
    ORDER BY BC.BoxCollectionId DESC;
END;
GO

-- 6. Stored Procedure: GET BY ID
CREATE OR ALTER PROCEDURE [dbo].[NU_sp_BoxCollection_GetById]
    @BoxCollectionId INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        BC.BoxCollectionId,
        BC.CollectionNumber,
        BC.EventGroupKey,
        EG.EventGroupName,
        BC.CollectionDate,
        BC.Amount,
        BC.ConsiderForAudit,
        BC.Remarks
    FROM NU_BoxCollections BC
    LEFT JOIN NU_EventGroups EG ON BC.EventGroupKey = EG.EventGroupId
    WHERE BC.BoxCollectionId = @BoxCollectionId AND BC.DeletedFlag = 0;
END;
GO
