-- Add RelatedPaymentID column and Foreign Key constraint
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('NU_Payments') AND name = 'RelatedPaymentID')
BEGIN
    ALTER TABLE NU_Payments ADD RelatedPaymentID INT NULL;
    
    ALTER TABLE NU_Payments ADD CONSTRAINT FK_NU_Payments_RelatedPaymentID 
    FOREIGN KEY (RelatedPaymentID) REFERENCES NU_Payments (PaymentId);
END
GO
