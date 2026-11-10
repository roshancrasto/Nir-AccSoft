-- 024_Add_BankAccountId_To_Receipts_And_Payments.sql
-- Add BankAccountId to NU_Receipts and NU_Payments, and update stored procedures

-- 1. Alter NU_Receipts if BankAccountId does not exist
IF NOT EXISTS (
    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'NU_Receipts' AND COLUMN_NAME = 'BankAccountId'
)
BEGIN
    ALTER TABLE NU_Receipts ADD BankAccountId INT NULL;
END
GO

-- 2. Alter NU_Payments if BankAccountId does not exist
IF NOT EXISTS (
    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'NU_Payments' AND COLUMN_NAME = 'BankAccountId'
)
BEGIN
    ALTER TABLE NU_Payments ADD BankAccountId INT NULL;
END
GO

-- 3. Set existing bank transactions to Bank account key 1
UPDATE NU_Receipts
SET BankAccountId = 1
WHERE BankAccountId IS NULL AND (BankAmount > 0 OR PaymentMode = 'Bank');
GO

UPDATE NU_Payments
SET BankAccountId = 1
WHERE BankAccountId IS NULL AND PaymentMode = 'Bank';
GO

-- 4. Update NU_sp_Receipt_Insert
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
    @CreatedBy INT,
    @BankAccountId INT = NULL
AS
BEGIN
    INSERT INTO NU_Receipts (
        ReceiptNumber, ReceiptDate, ReceivedDate, DonorId, EventKey, EventGroupKey, 
        PaymentMode, CashAmount, BankAmount, ReferenceNumber, PANAvailable, 
        Description, ReceiptBook_Rno, CreatedBy, ModifiedDate, BankAccountId
    )
    VALUES (
        @ReceiptNumber, @ReceiptDate, @ReceivedDate, @DonorId, @EventKey, @EventGroupKey, 
        @PaymentMode, @CashAmount, @BankAmount, @ReferenceNumber, @PANAvailable, 
        @Description, @ReceiptBook_Rno, @CreatedBy, GETDATE(), @BankAccountId
    );
    
    SELECT SCOPE_IDENTITY() AS ReceiptId;
END;
GO

-- 5. Update NU_sp_Receipt_Update
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
    @ModifiedBy INT,
    @BankAccountId INT = NULL
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
        ModifiedDate = GETDATE(),
        BankAccountId = @BankAccountId
    WHERE ReceiptId = @ReceiptId;
END;
GO

-- 6. Update NU_sp_Receipt_GetAll
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
        R.ReceiptBook_Rno,
        R.BankAccountId,
        CASE WHEN B.Branch IS NOT NULL AND B.Branch <> '' 
             THEN B.BankName + ' - ' + B.Branch 
             ELSE B.BankName END AS BankName
    FROM NU_Receipts R
    LEFT JOIN NU_Donors D ON R.DonorId = D.DonorId
    LEFT JOIN NU_EventDetails ED ON R.EventKey = ED.EventKey
    LEFT JOIN NU_EventGroups EG ON R.EventGroupKey = EG.EventGroupId
    LEFT JOIN NU_BankAccountDetails B ON R.BankAccountId = B.BankAccountkey
    WHERE R.DeletedFlag = 0;
END;
GO

-- 7. Update NU_sp_Payment_Insert
CREATE OR ALTER PROCEDURE [dbo].[NU_sp_Payment_Insert]
    @VoucherNumber NVARCHAR(50),
    @VoucherDate DATE,
    @PaymentDate DATE,
    @VendorId INT,
    @EventKey INT,
    @EventGroupKey INT,
    @ExpenseCategoryId INT,
    @PaymentMode NVARCHAR(50),
    @DebitAmount DECIMAL(18,2),
    @Description NVARCHAR(MAX),
    @BillAvailable BIT,
    @BillNumber NVARCHAR(100),
    @BillDate DATE,
    @ReferenceNumber NVARCHAR(100),
    @EnteredBy INT,
    @VerifiedBy INT,
    @AttachmentPath NVARCHAR(MAX),
    @RelatedPaymentID INT,
    @CreatedBy INT,
    @IsReimbursement BIT = 0,
    @MemberId INT = NULL,
    @IsVoucherOnly BIT = 0,
    @PaymentType NVARCHAR(50) = 'Normal',
    @BankAccountId INT = NULL
AS
BEGIN
    INSERT INTO NU_Payments (
        VoucherNumber, VoucherDate, PaymentDate, VendorId, EventKey, EventGroupKey, 
        ExpenseCategoryId, PaymentMode, DebitAmount, Description, BillAvailable, 
        BillNumber, BillDate, ReferenceNumber, EnteredBy, VerifiedBy, AttachmentPath, 
        RelatedPaymentID, CreatedBy, ModifiedDate, IsReimbursement, MemberId, IsVoucherOnly, PaymentType,
        BankAccountId
    )
    VALUES (
        @VoucherNumber, @VoucherDate, @PaymentDate, @VendorId, @EventKey, @EventGroupKey, 
        @ExpenseCategoryId, @PaymentMode, @DebitAmount, @Description, @BillAvailable, 
        @BillNumber, @BillDate, @ReferenceNumber, @EnteredBy, @VerifiedBy, @AttachmentPath, 
        @RelatedPaymentID, @CreatedBy, GETDATE(), @IsReimbursement, @MemberId, @IsVoucherOnly, @PaymentType,
        @BankAccountId
    );
    
    SELECT SCOPE_IDENTITY() AS PaymentId;
END;
GO

-- 8. Update NU_sp_Payment_Update
CREATE OR ALTER PROCEDURE [dbo].[NU_sp_Payment_Update]
    @PaymentId INT,
    @VoucherDate DATE,
    @PaymentDate DATE,
    @VendorId INT,
    @EventKey INT,
    @EventGroupKey INT,
    @ExpenseCategoryId INT,
    @PaymentMode NVARCHAR(50),
    @DebitAmount DECIMAL(18,2),
    @Description NVARCHAR(MAX),
    @BillAvailable BIT,
    @BillNumber NVARCHAR(100),
    @BillDate DATE,
    @ReferenceNumber NVARCHAR(100),
    @EnteredBy INT,
    @VerifiedBy INT,
    @AttachmentPath NVARCHAR(MAX),
    @RelatedPaymentID INT,
    @ModifiedBy INT,
    @MemberId INT = NULL,
    @IsVoucherOnly BIT = 0,
    @IsReimbursement BIT = 0,
    @PaymentType NVARCHAR(50) = 'Normal',
    @BankAccountId INT = NULL
AS
BEGIN
    UPDATE NU_Payments
    SET VoucherDate = @VoucherDate,
        PaymentDate = @PaymentDate,
        VendorId = @VendorId,
        EventKey = @EventKey,
        EventGroupKey = @EventGroupKey,
        ExpenseCategoryId = @ExpenseCategoryId,
        PaymentMode = @PaymentMode,
        DebitAmount = @DebitAmount,
        Description = @Description,
        BillAvailable = @BillAvailable,
        BillNumber = @BillNumber,
        BillDate = @BillDate,
        ReferenceNumber = @ReferenceNumber,
        EnteredBy = @EnteredBy,
        VerifiedBy = @VerifiedBy,
        AttachmentPath = @AttachmentPath,
        RelatedPaymentID = @RelatedPaymentID,
        ModifiedBy = @ModifiedBy,
        ModifiedDate = GETDATE(),
        MemberId = @MemberId,
        IsVoucherOnly = @IsVoucherOnly,
        IsReimbursement = @IsReimbursement,
        PaymentType = @PaymentType,
        BankAccountId = @BankAccountId
    WHERE PaymentId = @PaymentId;
END;
GO

-- 9. Update NU_sp_Payment_GetAll
CREATE OR ALTER PROCEDURE [dbo].[NU_sp_Payment_GetAll]
AS
BEGIN
    SELECT 
        P.PaymentId, P.VoucherNumber, P.VoucherDate, P.PaymentDate, 
        P.VendorId, V.VendorName, 
        P.EventKey, ED.EventName, 
        P.EventGroupKey, EG.EventGroupName,
        P.ExpenseCategoryId, C.CategoryName,
        P.PaymentMode, P.DebitAmount, P.Description, 
        P.BillAvailable, P.BillNumber, P.BillDate, 
        P.ReferenceNumber, P.EnteredBy, P.VerifiedBy, P.AttachmentPath,
        P.RelatedPaymentID, P.IsReimbursement, P.MemberId, P.IsVoucherOnly, P.PaymentType,
        RP.VoucherNumber AS RelatedVoucherNumber,
        RV.VendorName AS RelatedVendorName,
        RP.DebitAmount AS RelatedAmount,
        P.BankAccountId,
        CASE WHEN B.Branch IS NOT NULL AND B.Branch <> '' 
             THEN B.BankName + ' - ' + B.Branch 
             ELSE B.BankName END AS BankName
    FROM NU_Payments P
    LEFT JOIN NU_Vendors V ON P.VendorId = V.VendorId
    LEFT JOIN NU_EventDetails ED ON P.EventKey = ED.EventKey
    LEFT JOIN NU_EventGroups EG ON P.EventGroupKey = EG.EventGroupId
    LEFT JOIN NU_Categories C ON P.ExpenseCategoryId = C.CategoryId
    LEFT JOIN NU_Payments RP ON P.RelatedPaymentID = RP.PaymentId
    LEFT JOIN NU_Vendors RV ON RP.VendorId = RV.VendorId
    LEFT JOIN NU_BankAccountDetails B ON P.BankAccountId = B.BankAccountkey
    WHERE P.DeletedFlag = 0;
END;
GO

-- 10. Update NU_sp_Payment_GetById
CREATE OR ALTER PROCEDURE [dbo].[NU_sp_Payment_GetById]
    @PaymentId INT
AS
BEGIN
    SELECT 
        P.PaymentId, P.VoucherNumber, P.VoucherDate, P.PaymentDate, 
        P.VendorId, V.VendorName, 
        P.EventKey, ED.EventName, 
        P.EventGroupKey, EG.EventGroupName,
        P.ExpenseCategoryId, C.CategoryName,
        P.PaymentMode, P.DebitAmount, P.Description, 
        P.BillAvailable, P.BillNumber, P.BillDate, 
        P.ReferenceNumber, P.EnteredBy, P.VerifiedBy, P.AttachmentPath,
        P.RelatedPaymentID, P.IsReimbursement, P.MemberId, P.IsVoucherOnly, P.PaymentType,
        RP.VoucherNumber AS RelatedVoucherNumber,
        RV.VendorName AS RelatedVendorName,
        RP.DebitAmount AS RelatedAmount,
        P.BankAccountId,
        CASE WHEN B.Branch IS NOT NULL AND B.Branch <> '' 
             THEN B.BankName + ' - ' + B.Branch 
             ELSE B.BankName END AS BankName
    FROM NU_Payments P
    LEFT JOIN NU_Vendors V ON P.VendorId = V.VendorId
    LEFT JOIN NU_EventDetails ED ON P.EventKey = ED.EventKey
    LEFT JOIN NU_EventGroups EG ON P.EventGroupKey = EG.EventGroupId
    LEFT JOIN NU_Categories C ON P.ExpenseCategoryId = C.CategoryId
    LEFT JOIN NU_Payments RP ON P.RelatedPaymentID = RP.PaymentId
    LEFT JOIN NU_Vendors RV ON RP.VendorId = RV.VendorId
    LEFT JOIN NU_BankAccountDetails B ON P.BankAccountId = B.BankAccountkey
    WHERE P.PaymentId = @PaymentId AND P.DeletedFlag = 0;
END;
GO
