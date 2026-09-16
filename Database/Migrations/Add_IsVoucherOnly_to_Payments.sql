IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('NU_Payments') AND name = 'IsVoucherOnly')
BEGIN
    ALTER TABLE NU_Payments ADD IsVoucherOnly BIT NULL;
END
GO
