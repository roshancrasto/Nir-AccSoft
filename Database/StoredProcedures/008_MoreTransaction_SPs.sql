-- Stored Procedures for Reimbursements, Assets, and Bank Transfers

-- REIMBURSEMENTS --

CREATE OR ALTER PROCEDURE NU_sp_Reimbursement_Insert
    @ReimbursementNumber NVARCHAR(50),
    @ReimbursementDate DATE,
    @UserId INT,
    @EventGroupId INT,
    @ExpenseCategoryId INT,
    @Amount DECIMAL(18,2),
    @Description NVARCHAR(MAX),
    @BillAvailable BIT,
    @BillNumber NVARCHAR(100),
    @BillDate DATE,
    @AttachmentPath NVARCHAR(MAX),
    @Status NVARCHAR(50),
    @CreatedBy INT
AS
BEGIN
    INSERT INTO NU_Reimbursements (ReimbursementNumber, ReimbursementDate, UserId, EventGroupId, ExpenseCategoryId, Amount, Description, BillAvailable, BillNumber, BillDate, AttachmentPath, Status, CreatedBy, ModifiedDate)
    VALUES (@ReimbursementNumber, @ReimbursementDate, @UserId, @EventGroupId, @ExpenseCategoryId, @Amount, @Description, @BillAvailable, @BillNumber, @BillDate, @AttachmentPath, @Status, @CreatedBy, GETDATE());
    
    SELECT SCOPE_IDENTITY() AS ReimbursementId;
END;
GO

CREATE OR ALTER PROCEDURE NU_sp_Reimbursement_Update
    @ReimbursementId INT,
    @ReimbursementDate DATE,
    @UserId INT,
    @EventGroupId INT,
    @ExpenseCategoryId INT,
    @Amount DECIMAL(18,2),
    @Description NVARCHAR(MAX),
    @BillAvailable BIT,
    @BillNumber NVARCHAR(100),
    @BillDate DATE,
    @AttachmentPath NVARCHAR(MAX),
    @Status NVARCHAR(50),
    @ModifiedBy INT
AS
BEGIN
    UPDATE NU_Reimbursements
    SET ReimbursementDate = @ReimbursementDate,
        UserId = @UserId,
        EventGroupId = @EventGroupId,
        ExpenseCategoryId = @ExpenseCategoryId,
        Amount = @Amount,
        Description = @Description,
        BillAvailable = @BillAvailable,
        BillNumber = @BillNumber,
        BillDate = @BillDate,
        AttachmentPath = @AttachmentPath,
        Status = @Status,
        ModifiedBy = @ModifiedBy,
        ModifiedDate = GETDATE()
    WHERE ReimbursementId = @ReimbursementId;
END;
GO

CREATE OR ALTER PROCEDURE NU_sp_Reimbursement_Delete
    @ReimbursementId INT,
    @ModifiedBy INT
AS
BEGIN
    UPDATE NU_Reimbursements
    SET DeletedFlag = 1,
        ModifiedBy = @ModifiedBy,
        ModifiedDate = GETDATE()
    WHERE ReimbursementId = @ReimbursementId;
END;
GO

CREATE OR ALTER PROCEDURE NU_sp_Reimbursement_GetAll
AS
BEGIN
    SELECT ReimbursementId, ReimbursementNumber, ReimbursementDate, UserId, EventGroupId, ExpenseCategoryId, Amount, Description, BillAvailable, BillNumber, BillDate, AttachmentPath, Status
    FROM NU_Reimbursements
    WHERE DeletedFlag = 0;
END;
GO

-- ASSETS --

CREATE OR ALTER PROCEDURE NU_sp_Asset_Insert
    @AssetNumber NVARCHAR(50),
    @AssetName NVARCHAR(200),
    @PurchaseDate DATE,
    @PurchaseValue DECIMAL(18,2),
    @CurrentValue DECIMAL(18,2),
    @DepreciationRate DECIMAL(5,2),
    @Location NVARCHAR(200),
    @Condition NVARCHAR(50),
    @PaymentId INT,
    @CreatedBy INT
AS
BEGIN
    INSERT INTO NU_Assets (AssetNumber, AssetName, PurchaseDate, PurchaseValue, CurrentValue, DepreciationRate, Location, Condition, PaymentId, CreatedBy, ModifiedDate)
    VALUES (@AssetNumber, @AssetName, @PurchaseDate, @PurchaseValue, @CurrentValue, @DepreciationRate, @Location, @Condition, @PaymentId, @CreatedBy, GETDATE());
    
    SELECT SCOPE_IDENTITY() AS AssetId;
END;
GO

CREATE OR ALTER PROCEDURE NU_sp_Asset_Update
    @AssetId INT,
    @AssetName NVARCHAR(200),
    @PurchaseDate DATE,
    @PurchaseValue DECIMAL(18,2),
    @CurrentValue DECIMAL(18,2),
    @DepreciationRate DECIMAL(5,2),
    @Location NVARCHAR(200),
    @Condition NVARCHAR(50),
    @PaymentId INT,
    @ModifiedBy INT
AS
BEGIN
    UPDATE NU_Assets
    SET AssetName = @AssetName,
        PurchaseDate = @PurchaseDate,
        PurchaseValue = @PurchaseValue,
        CurrentValue = @CurrentValue,
        DepreciationRate = @DepreciationRate,
        Location = @Location,
        Condition = @Condition,
        PaymentId = @PaymentId,
        ModifiedBy = @ModifiedBy,
        ModifiedDate = GETDATE()
    WHERE AssetId = @AssetId;
END;
GO

CREATE OR ALTER PROCEDURE NU_sp_Asset_Delete
    @AssetId INT,
    @ModifiedBy INT
AS
BEGIN
    UPDATE NU_Assets
    SET DeletedFlag = 1,
        ModifiedBy = @ModifiedBy,
        ModifiedDate = GETDATE()
    WHERE AssetId = @AssetId;
END;
GO

CREATE OR ALTER PROCEDURE NU_sp_Asset_GetAll
AS
BEGIN
    SELECT AssetId, AssetNumber, AssetName, PurchaseDate, PurchaseValue, CurrentValue, DepreciationRate, Location, Condition, PaymentId
    FROM NU_Assets
    WHERE DeletedFlag = 0;
END;
GO

-- BANK TRANSFERS --

CREATE OR ALTER PROCEDURE NU_sp_BankTransfer_Insert
    @TransferNumber NVARCHAR(50),
    @TransferDate DATE,
    @FromBankAccountId INT,
    @ToBankAccountId INT,
    @Amount DECIMAL(18,2),
    @ReferenceNumber NVARCHAR(100),
    @Description NVARCHAR(MAX),
    @CreatedBy INT
AS
BEGIN
    INSERT INTO NU_BankTransfers (TransferNumber, TransferDate, FromBankAccountId, ToBankAccountId, Amount, ReferenceNumber, Description, CreatedBy, ModifiedDate)
    VALUES (@TransferNumber, @TransferDate, @FromBankAccountId, @ToBankAccountId, @Amount, @ReferenceNumber, @Description, @CreatedBy, GETDATE());
    
    SELECT SCOPE_IDENTITY() AS TransferId;
END;
GO

CREATE OR ALTER PROCEDURE NU_sp_BankTransfer_Update
    @TransferId INT,
    @TransferDate DATE,
    @FromBankAccountId INT,
    @ToBankAccountId INT,
    @Amount DECIMAL(18,2),
    @ReferenceNumber NVARCHAR(100),
    @Description NVARCHAR(MAX),
    @ModifiedBy INT
AS
BEGIN
    UPDATE NU_BankTransfers
    SET TransferDate = @TransferDate,
        FromBankAccountId = @FromBankAccountId,
        ToBankAccountId = @ToBankAccountId,
        Amount = @Amount,
        ReferenceNumber = @ReferenceNumber,
        Description = @Description,
        ModifiedBy = @ModifiedBy,
        ModifiedDate = GETDATE()
    WHERE TransferId = @TransferId;
END;
GO

CREATE OR ALTER PROCEDURE NU_sp_BankTransfer_Delete
    @TransferId INT,
    @ModifiedBy INT
AS
BEGIN
    UPDATE NU_BankTransfers
    SET DeletedFlag = 1,
        ModifiedBy = @ModifiedBy,
        ModifiedDate = GETDATE()
    WHERE TransferId = @TransferId;
END;
GO

CREATE OR ALTER PROCEDURE NU_sp_BankTransfer_GetAll
AS
BEGIN
    SELECT TransferId, TransferNumber, TransferDate, FromBankAccountId, ToBankAccountId, Amount, ReferenceNumber, Description
    FROM NU_BankTransfers
    WHERE DeletedFlag = 0;
END;
GO
