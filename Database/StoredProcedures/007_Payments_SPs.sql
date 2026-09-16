-- Updated Stored Procedures for Payments
CREATE OR ALTER PROCEDURE NU_sp_Payment_Insert
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
    @IsReimbursement BIT,
    @MemberId INT,
    @IsVoucherOnly BIT = NULL,
    @PaymentType NVARCHAR(50) = NULL
AS
BEGIN
    INSERT INTO NU_Payments (VoucherNumber, VoucherDate, PaymentDate, VendorId, EventKey, EventGroupKey, ExpenseCategoryId, PaymentMode, DebitAmount, Description, BillAvailable, BillNumber, BillDate, ReferenceNumber, EnteredBy, VerifiedBy, AttachmentPath, RelatedPaymentID, CreatedBy, ModifiedDate, IsReimbursement, MemberId, IsVoucherOnly, PaymentType)
    VALUES (@VoucherNumber, @VoucherDate, @PaymentDate, @VendorId, @EventKey, @EventGroupKey, @ExpenseCategoryId, @PaymentMode, @DebitAmount, @Description, @BillAvailable, @BillNumber, @BillDate, @ReferenceNumber, @EnteredBy, @VerifiedBy, @AttachmentPath, @RelatedPaymentID, @CreatedBy, GETDATE(), @IsReimbursement, @MemberId, @IsVoucherOnly, @PaymentType);
    
    SELECT SCOPE_IDENTITY() AS PaymentId;
END;
GO

CREATE OR ALTER PROCEDURE NU_sp_Payment_Update
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
    @IsReimbursement BIT,
    @MemberId INT,
    @IsVoucherOnly BIT = NULL,
    @PaymentType NVARCHAR(50) = NULL
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
        IsReimbursement = @IsReimbursement,
        MemberId = @MemberId,
        IsVoucherOnly = @IsVoucherOnly,
        PaymentType = @PaymentType
    WHERE PaymentId = @PaymentId;
END;
GO

CREATE OR ALTER PROCEDURE NU_sp_Payment_Delete
    @PaymentId INT,
    @ModifiedBy INT
AS
BEGIN
    UPDATE NU_Payments
    SET DeletedFlag = 1,
        ModifiedBy = @ModifiedBy,
        ModifiedDate = GETDATE()
    WHERE PaymentId = @PaymentId;

    -- Unsettle expense links if this was a reimbursement payment
    UPDATE NU_PaymentExpenseLinks
    SET IsSettled = 0,
        SettledDate = NULL,
        PaymentId = NULL,
        ModifiedBy = @ModifiedBy,
        ModifiedDate = GETDATE()
    WHERE PaymentId = @PaymentId;
END;
GO

CREATE OR ALTER PROCEDURE NU_sp_Payment_GetAll
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
        RP.DebitAmount AS RelatedAmount
    FROM NU_Payments P
    LEFT JOIN NU_Vendors V ON P.VendorId = V.VendorId
    LEFT JOIN NU_EventDetails ED ON P.EventKey = ED.EventKey
    LEFT JOIN NU_EventGroups EG ON P.EventGroupKey = EG.EventGroupId
    LEFT JOIN NU_Categories C ON P.ExpenseCategoryId = C.CategoryId
    LEFT JOIN NU_Payments RP ON P.RelatedPaymentID = RP.PaymentId
    LEFT JOIN NU_Vendors RV ON RP.VendorId = RV.VendorId
    WHERE P.DeletedFlag = 0;
END;
GO

CREATE OR ALTER PROCEDURE NU_sp_Payment_GetById
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
        RP.DebitAmount AS RelatedAmount
    FROM NU_Payments P
    LEFT JOIN NU_Vendors V ON P.VendorId = V.VendorId
    LEFT JOIN NU_EventDetails ED ON P.EventKey = ED.EventKey
    LEFT JOIN NU_EventGroups EG ON P.EventGroupKey = EG.EventGroupId
    LEFT JOIN NU_Categories C ON P.ExpenseCategoryId = C.CategoryId
    LEFT JOIN NU_Payments RP ON P.RelatedPaymentID = RP.PaymentId
    LEFT JOIN NU_Vendors RV ON RP.VendorId = RV.VendorId
    WHERE P.PaymentId = @PaymentId AND P.DeletedFlag = 0;
END;
GO
