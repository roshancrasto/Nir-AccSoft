USE [AccSoft];
GO

-- 1. Create Table NU_OpeningBalances
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[NU_OpeningBalances]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[NU_OpeningBalances](
        [OpeningBalanceId] [int] IDENTITY(1,1) NOT NULL,
        [FinancialYear] [nvarchar](20) NOT NULL,
        [BalanceType] [nvarchar](20) NOT NULL,
        [BankAccountId] [int] NULL,
        [OpeningAmount] [decimal](18, 2) NOT NULL,
        [Remarks] [nvarchar](500) NULL,
        [CreatedBy] [int] NULL,
        [CreatedDate] [datetime] NOT NULL DEFAULT (GETDATE()),
        [ModifiedBy] [int] NULL,
        [ModifiedDate] [datetime] NULL,
        [DeletedFlag] [bit] NOT NULL DEFAULT ((0)),
        [IsActive] [bit] NOT NULL DEFAULT ((1)),
        CONSTRAINT [PK_NU_OpeningBalances] PRIMARY KEY CLUSTERED 
        (
            [OpeningBalanceId] ASC
        )
    ) ON [PRIMARY]
END
GO

-- 2. Stored Procedure: Insert
IF OBJECT_ID('NU_sp_OpeningBalance_Insert', 'P') IS NOT NULL
    DROP PROCEDURE NU_sp_OpeningBalance_Insert;
GO
CREATE PROCEDURE NU_sp_OpeningBalance_Insert
    @FinancialYear NVARCHAR(20),
    @BalanceType NVARCHAR(20),
    @BankAccountId INT = NULL,
    @OpeningAmount DECIMAL(18,2),
    @Remarks NVARCHAR(500) = NULL,
    @CreatedBy INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- Validate duplicate
    IF EXISTS (
        SELECT 1 FROM NU_OpeningBalances 
        WHERE FinancialYear = @FinancialYear 
          AND BalanceType = @BalanceType 
          AND ISNULL(BankAccountId, 0) = ISNULL(@BankAccountId, 0)
          AND DeletedFlag = 0
    )
    BEGIN
        RAISERROR('Opening balance for this account and financial year already exists.', 16, 1);
        RETURN;
    END

    INSERT INTO NU_OpeningBalances (
        FinancialYear, BalanceType, BankAccountId, OpeningAmount, Remarks, CreatedBy, CreatedDate, DeletedFlag, IsActive
    )
    VALUES (
        @FinancialYear, @BalanceType, @BankAccountId, @OpeningAmount, @Remarks, @CreatedBy, GETDATE(), 0, 1
    );

    SELECT SCOPE_IDENTITY();
END
GO

-- 3. Stored Procedure: Update
IF OBJECT_ID('NU_sp_OpeningBalance_Update', 'P') IS NOT NULL
    DROP PROCEDURE NU_sp_OpeningBalance_Update;
GO
CREATE PROCEDURE NU_sp_OpeningBalance_Update
    @OpeningBalanceId INT,
    @FinancialYear NVARCHAR(20),
    @BalanceType NVARCHAR(20),
    @BankAccountId INT = NULL,
    @OpeningAmount DECIMAL(18,2),
    @Remarks NVARCHAR(500) = NULL,
    @ModifiedBy INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- Validate duplicate for other records
    IF EXISTS (
        SELECT 1 FROM NU_OpeningBalances 
        WHERE FinancialYear = @FinancialYear 
          AND BalanceType = @BalanceType 
          AND ISNULL(BankAccountId, 0) = ISNULL(@BankAccountId, 0)
          AND DeletedFlag = 0
          AND OpeningBalanceId <> @OpeningBalanceId
    )
    BEGIN
        RAISERROR('Opening balance for this account and financial year already exists.', 16, 1);
        RETURN;
    END

    UPDATE NU_OpeningBalances
    SET FinancialYear = @FinancialYear,
        BalanceType = @BalanceType,
        BankAccountId = @BankAccountId,
        OpeningAmount = @OpeningAmount,
        Remarks = @Remarks,
        ModifiedBy = @ModifiedBy,
        ModifiedDate = GETDATE()
    WHERE OpeningBalanceId = @OpeningBalanceId;
END
GO

-- 4. Stored Procedure: Delete (Soft Delete)
IF OBJECT_ID('NU_sp_OpeningBalance_Delete', 'P') IS NOT NULL
    DROP PROCEDURE NU_sp_OpeningBalance_Delete;
GO
CREATE PROCEDURE NU_sp_OpeningBalance_Delete
    @OpeningBalanceId INT,
    @ModifiedBy INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE NU_OpeningBalances
    SET DeletedFlag = 1,
        ModifiedBy = @ModifiedBy,
        ModifiedDate = GETDATE()
    WHERE OpeningBalanceId = @OpeningBalanceId;
END
GO

-- 5. Stored Procedure: GetAll
IF OBJECT_ID('NU_sp_OpeningBalance_GetAll', 'P') IS NOT NULL
    DROP PROCEDURE NU_sp_OpeningBalance_GetAll;
GO
CREATE PROCEDURE NU_sp_OpeningBalance_GetAll
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        ob.OpeningBalanceId,
        ob.FinancialYear,
        ob.BalanceType,
        ob.BankAccountId,
        ob.OpeningAmount,
        ob.Remarks,
        ob.IsActive,
        ba.BankName,
        ba.Branch
    FROM NU_OpeningBalances ob
    LEFT JOIN NU_BankAccountDetails ba ON ob.BankAccountId = ba.BankAccountkey
    WHERE ob.DeletedFlag = 0
    ORDER BY ob.FinancialYear DESC, ob.BalanceType, ba.BankName;
END
GO

-- 6. Stored Procedure: GetById
IF OBJECT_ID('NU_sp_OpeningBalance_GetById', 'P') IS NOT NULL
    DROP PROCEDURE NU_sp_OpeningBalance_GetById;
GO
CREATE PROCEDURE NU_sp_OpeningBalance_GetById
    @OpeningBalanceId INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        ob.OpeningBalanceId,
        ob.FinancialYear,
        ob.BalanceType,
        ob.BankAccountId,
        ob.OpeningAmount,
        ob.Remarks,
        ob.IsActive,
        ba.BankName,
        ba.Branch
    FROM NU_OpeningBalances ob
    LEFT JOIN NU_BankAccountDetails ba ON ob.BankAccountId = ba.BankAccountkey
    WHERE ob.OpeningBalanceId = @OpeningBalanceId AND ob.DeletedFlag = 0;
END
GO
