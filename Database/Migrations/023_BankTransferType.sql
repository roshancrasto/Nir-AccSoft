-- Create NU_BankTransferType table and sp_GetBankTransferTypes
IF OBJECT_ID('dbo.NU_BankTransferType', 'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[NU_BankTransferType] (
        [TransferTypeId] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [TransferTypeName] NVARCHAR(100) NOT NULL,
        [IsActive] BIT NOT NULL CONSTRAINT [DF_NU_BankTransferType_IsActive] DEFAULT ((1)),
        [DeductFromSource] BIT NOT NULL CONSTRAINT [DF_NU_BankTransferType_DeductFromSource] DEFAULT ((1))
    );

    SET IDENTITY_INSERT [dbo].[NU_BankTransferType] ON;
    INSERT INTO [dbo].[NU_BankTransferType] ([TransferTypeId], [TransferTypeName], [IsActive], [DeductFromSource])
    VALUES
    (1, N'Cash Deposit', 1, 1),
    (2, N'Cash Withdrawal', 1, 1),
    (3, N'Bank To Bank', 1, 1),
    (4, N'Transfer To Petty Cash', 1, 1),
    (5, N'Transfer To Fixed Deposit', 1, 1),
    (6, N'Fixed Deposit Maturity', 1, 1),
    (7, N'General Transfer', 1, 1),
    (8, N'FD Interest', 1, 0),
    (9, N'QR Code Collection', 1, 1);
    SET IDENTITY_INSERT [dbo].[NU_BankTransferType] OFF;
END
GO

-- 2. Add QR Code Collection to NU_BankAccountDetails if not present
IF NOT EXISTS (SELECT 1 FROM NU_BankAccountDetails WHERE BankName = 'QR Code Collection' OR AccountType = 'QR Code Collection')
BEGIN
    DECLARE @NextKey INT = ISNULL((SELECT MAX(BankAccountkey) FROM NU_BankAccountDetails), 0) + 1;
    INSERT INTO NU_BankAccountDetails (BankAccountkey, BankName, Branch, IFSCCode, AccountType)
    VALUES (@NextKey, 'QR Code Collection', NULL, NULL, 'QR Code Collection');
END
GO

CREATE OR ALTER PROCEDURE [dbo].[sp_GetBankTransferTypes]
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        TransferTypeId,
        TransferTypeName,
        IsActive
    FROM 
        NU_BankTransferType
    WHERE 
        IsActive = 1;
END
GO

