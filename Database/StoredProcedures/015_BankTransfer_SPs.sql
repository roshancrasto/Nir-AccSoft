-- Stored Procedures for Bank Transfers
CREATE OR ALTER PROCEDURE NU_sp_BankTransfer_Insert
    @TransferNo NVARCHAR(50),
    @TransferDate DATETIME,
    @TransferType NVARCHAR(50),
    @FromAccountType NVARCHAR(50),
    @FromAccountID INT,
    @ToAccountType NVARCHAR(50),
    @ToAccountID INT,
    @Amount DECIMAL(18, 2),
    @ReferenceNumber NVARCHAR(100),
    @Remarks NVARCHAR(MAX),
    @CreatedBy INT
AS
BEGIN
    INSERT INTO NU_BankTransfers (
        TransferNo, TransferDate, TransferType, FromAccountType, FromAccountID, 
        ToAccountType, ToAccountID, Amount, ReferenceNumber, Remarks, CreatedBy, CreatedDate
    )
    VALUES (
        @TransferNo, @TransferDate, @TransferType, @FromAccountType, @FromAccountID, 
        @ToAccountType, @ToAccountID, @Amount, @ReferenceNumber, @Remarks, @CreatedBy, GETDATE()
    );
    
    SELECT SCOPE_IDENTITY() AS TransferId;
END;
GO

CREATE OR ALTER PROCEDURE NU_sp_BankTransfer_Update
    @TransferId INT,
    @TransferDate DATETIME,
    @TransferType NVARCHAR(50),
    @FromAccountType NVARCHAR(50),
    @FromAccountID INT,
    @ToAccountType NVARCHAR(50),
    @ToAccountID INT,
    @Amount DECIMAL(18, 2),
    @ReferenceNumber NVARCHAR(100),
    @Remarks NVARCHAR(MAX),
    @ModifiedBy INT
AS
BEGIN
    UPDATE NU_BankTransfers
    SET TransferDate = @TransferDate,
        TransferType = @TransferType,
        FromAccountType = @FromAccountType,
        FromAccountID = @FromAccountID,
        ToAccountType = @ToAccountType,
        ToAccountID = @ToAccountID,
        Amount = @Amount,
        ReferenceNumber = @ReferenceNumber,
        Remarks = @Remarks,
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
    SELECT 
        TransferId, TransferNo, TransferDate, TransferType, 
        FromAccountType, FromAccountID, ToAccountType, ToAccountID, 
        Amount, ReferenceNumber, Remarks, CreatedBy, CreatedDate
    FROM NU_BankTransfers
    WHERE DeletedFlag = 0
    ORDER BY TransferDate DESC, TransferId DESC;
END;
GO

CREATE OR ALTER PROCEDURE NU_sp_BankTransfer_GetById
    @TransferId INT
AS
BEGIN
    SELECT 
        TransferId, TransferNo, TransferDate, TransferType, 
        FromAccountType, FromAccountID, ToAccountType, ToAccountID, 
        Amount, ReferenceNumber, Remarks, CreatedBy, CreatedDate
    FROM NU_BankTransfers
    WHERE TransferId = @TransferId AND DeletedFlag = 0;
END;
GO
