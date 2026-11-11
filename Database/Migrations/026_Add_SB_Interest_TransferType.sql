-- Add "SB Interest" (savings bank interest credited to a bank account) to Bank Transfers,
-- following the same pattern as "QR Code Collection" in 023_BankTransferType.sql.
-- Safe to run more than once.

-- 1. Transfer type
IF NOT EXISTS (SELECT 1 FROM [dbo].[NU_BankTransferType] WHERE [TransferTypeName] = N'SB Interest')
BEGIN
    -- Interest is income credited by the bank, not money moved out of another account (same as FD Interest).
    INSERT INTO [dbo].[NU_BankTransferType] ([TransferTypeName], [IsActive], [DeductFromSource])
    VALUES (N'SB Interest', 1, 0);
END
GO

-- 2. "SB Interest" source account
IF NOT EXISTS (SELECT 1 FROM NU_BankAccountDetails WHERE BankName = 'SB Interest' OR AccountType = 'SB Interest')
BEGIN
    DECLARE @NextKey INT = ISNULL((SELECT MAX(BankAccountkey) FROM NU_BankAccountDetails), 0) + 1;
    INSERT INTO NU_BankAccountDetails (BankAccountkey, BankName, Branch, IFSCCode, AccountType)
    VALUES (@NextKey, 'SB Interest', NULL, NULL, 'SB Interest');
END
GO
