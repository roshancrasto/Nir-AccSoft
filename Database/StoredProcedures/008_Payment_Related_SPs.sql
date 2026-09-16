CREATE OR ALTER PROCEDURE NU_sp_Payment_GetRelated
    @EventGroupKey INT = NULL,
    @CurrentPaymentID INT = NULL
AS
BEGIN
    SELECT 
        P.PaymentId, 
        P.VoucherNumber, 
        V.VendorName, 
        P.DebitAmount AS Amount, 
        P.PaymentDate
    FROM NU_Payments P
    LEFT JOIN NU_Vendors V ON P.VendorId = V.VendorId
    WHERE P.DeletedFlag = 0
      AND (@EventGroupKey IS NULL OR P.EventGroupKey = @EventGroupKey)
      AND (@CurrentPaymentID IS NULL OR P.PaymentId <> @CurrentPaymentID)
      AND P.RelatedPaymentID IS NULL
      AND (V.VendorName IS NULL OR V.VendorName <> 'Bank Charges')
      AND P.PaymentId NOT IN (
          SELECT RelatedPaymentID 
          FROM NU_Payments 
          WHERE RelatedPaymentID IS NOT NULL 
            AND DeletedFlag = 0
            AND (@CurrentPaymentID IS NULL OR PaymentId <> @CurrentPaymentID)
      )
END;
GO
