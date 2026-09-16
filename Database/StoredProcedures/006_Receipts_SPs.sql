-- Updated Stored Procedures for Receipts (Refactored for Event Details)

CREATE OR ALTER PROCEDURE [dbo].[NU_sp_Receipt_Insert]
    @ReceiptNumber VARCHAR(20),
    @ReceiptDate DATETIME,
    @ReceivedDate DATETIME = NULL,
    @DonorId INT,
    @EventKey INT,
    @EventGroupKey INT,
    @PaymentMode VARCHAR(20),
    @CashAmount DECIMAL(18,2),
    @BankAmount DECIMAL(18,2),
    @ReferenceNumber VARCHAR(50),
    @PANAvailable BIT,
    @Description VARCHAR(500),
    @ReceiptBook_Rno INT,
    @CreatedBy INT
AS
BEGIN
    INSERT INTO NU_Receipts (ReceiptNumber, ReceiptDate, ReceivedDate, DonorId, EventKey, EventGroupKey, PaymentMode, CashAmount, BankAmount, ReferenceNumber, PANAvailable, Description, ReceiptBook_Rno, CreatedBy, ModifiedDate)
    VALUES (@ReceiptNumber, @ReceiptDate, @ReceivedDate, @DonorId, @EventKey, @EventGroupKey, @PaymentMode, @CashAmount, @BankAmount, @ReferenceNumber, @PANAvailable, @Description, @ReceiptBook_Rno, @CreatedBy, GETDATE());
    
    SELECT SCOPE_IDENTITY() AS ReceiptId;
END;
GO

CREATE OR ALTER PROCEDURE [dbo].[NU_sp_Receipt_Update]
    @ReceiptId INT,
    @ReceiptDate DATETIME,
    @ReceivedDate DATETIME = NULL,
    @DonorId INT,
    @EventKey INT,
    @EventGroupKey INT,
    @PaymentMode VARCHAR(20),
    @CashAmount DECIMAL(18,2),
    @BankAmount DECIMAL(18,2),
    @ReferenceNumber VARCHAR(50),
    @PANAvailable BIT,
    @Description VARCHAR(500),
    @ReceiptBook_Rno INT,
    @ModifiedBy INT
AS
BEGIN
    UPDATE NU_Receipts
    SET ReceiptDate = @ReceiptDate,
        ReceivedDate = @ReceivedDate,
        DonorId = @DonorId,
        EventKey = @EventKey,
        EventGroupKey = @EventGroupKey,
        PaymentMode = @PaymentMode,
        CashAmount = @CashAmount,
        BankAmount = @BankAmount,
        ReferenceNumber = @ReferenceNumber,
        PANAvailable = @PANAvailable,
        Description = @Description,
        ReceiptBook_Rno = @ReceiptBook_Rno,
        ModifiedBy = @ModifiedBy,
        ModifiedDate = GETDATE()
    WHERE ReceiptId = @ReceiptId;
END;
GO

CREATE OR ALTER PROCEDURE [dbo].[NU_sp_Receipt_Delete]
    @ReceiptId INT,
    @ModifiedBy INT
AS
BEGIN
    UPDATE NU_Receipts
    SET DeletedFlag = 1,
        ModifiedBy = @ModifiedBy,
        ModifiedDate = GETDATE()
    WHERE ReceiptId = @ReceiptId;
END;
GO

CREATE OR ALTER PROCEDURE [dbo].[NU_sp_Receipt_GetAll]
AS
BEGIN
    SELECT 
        R.ReceiptId, 
        R.ReceiptNumber, 
        R.ReceiptDate, 
        R.ReceivedDate,
        R.DonorId, 
        D.DonorName, 
        R.EventKey, 
        ED.EventName, 
        R.EventGroupKey,
        EG.EventGroupName,
        R.PaymentMode, 
        R.CashAmount, 
        R.BankAmount, 
        R.ReferenceNumber, 
        R.PANAvailable, 
        R.Description,
        R.ReceiptBook_Rno
    FROM NU_Receipts R
    LEFT JOIN NU_Donors D ON R.DonorId = D.DonorId
    LEFT JOIN NU_EventDetails ED ON R.EventKey = ED.EventKey
    LEFT JOIN NU_EventGroups EG ON R.EventGroupKey = EG.EventGroupId
    WHERE R.DeletedFlag = 0;
END;
GO
