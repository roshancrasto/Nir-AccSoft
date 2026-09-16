IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('NU_PaymentExpenseLinks') AND name = 'IsVoucherOnly')
BEGIN
    ALTER TABLE NU_PaymentExpenseLinks ADD IsVoucherOnly BIT NULL;
END
GO
