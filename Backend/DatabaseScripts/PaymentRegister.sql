ALTER PROCEDURE [dbo].[NU_sp_Report_PaymentRegister]
    @StartDate DATETIME,
    @EndDate DATETIME,
    @EventGroupKey INT = NULL,
    @PaymentMode NVARCHAR(50) = NULL,
    @VendorId INT = NULL,
    @ExpenseCategoryId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        p.PaymentId,
        p.VoucherNumber,
        p.VoucherDate,
        p.PaymentDate,
        eg.EventGroupName,
        c.CategoryName AS ExpenseCategory,
        (
            SELECT TOP 1 ee.ExpenseDetails 
            FROM NU_PaymentExpenseMapping pem
            INNER JOIN NU_EventExpenses ee ON pem.EventExpenseKey = ee.EventExpenseKey
            WHERE pem.PaymentID = p.PaymentId AND pem.DeletedFlag = 0
        ) AS ExpenseDetails,
        v.VendorName,
        p.PaymentMode,
        p.DebitAmount AS Amount,
        p.ReferenceNumber,
        p.Description AS Remarks,
        p.RelatedPaymentID AS RelatedPaymentNumber
    FROM NU_Payments p
    LEFT JOIN NU_Vendors v ON p.VendorId = v.VendorId
    LEFT JOIN NU_EventGroups eg ON p.EventGroupKey = eg.EventGroupId
    LEFT JOIN NU_Categories c ON p.ExpenseCategoryId = c.CategoryId
    WHERE p.PaymentDate BETWEEN @StartDate AND @EndDate
      AND p.DeletedFlag = 0
      AND (@EventGroupKey IS NULL OR p.EventGroupKey = @EventGroupKey)
      AND (@PaymentMode IS NULL OR p.PaymentMode = @PaymentMode)
      AND (@VendorId IS NULL OR p.VendorId = @VendorId)
      AND (@ExpenseCategoryId IS NULL OR p.ExpenseCategoryId = @ExpenseCategoryId)
    ORDER BY p.PaymentDate DESC;
END;
GO
