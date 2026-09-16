USE [AccSoft] -- Assuming default DB name, user can change if needed
GO

-- 1. Add AccountType to NU_BankAccountDetails
IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE Name = N'AccountType' 
      AND Object_ID = Object_ID(N'NU_BankAccountDetails')
)
BEGIN
    ALTER TABLE NU_BankAccountDetails
    ADD AccountType VARCHAR(30) DEFAULT 'Bank';
END
GO

-- Set existing records to 'Bank' if they are NULL
UPDATE NU_BankAccountDetails 
SET AccountType = 'Bank' 
WHERE AccountType IS NULL;
GO

-- 2. Create NU_sp_GetAccountBalances
IF OBJECT_ID('NU_sp_GetAccountBalances', 'P') IS NOT NULL
    DROP PROCEDURE NU_sp_GetAccountBalances;
GO

CREATE PROCEDURE NU_sp_GetAccountBalances
AS
BEGIN
    SET NOCOUNT ON;

    -- Create a temporary table to hold account balances
    CREATE TABLE #AccountBalances (
        AccountId INT,
        Balance DECIMAL(18,2) DEFAULT 0
    );

    -- 1. Insert distinct accounts from BankAccountDetails
    INSERT INTO #AccountBalances (AccountId)
    SELECT BankAccountkey FROM NU_BankAccountDetails;

    -- 2. Add Opening Balances
    -- Assuming OpeningBalance for banks is stored with BankAccountId
    UPDATE ab
    SET ab.Balance = ab.Balance + ISNULL(ob.OpeningAmount, 0)
    FROM #AccountBalances ab
    INNER JOIN NU_OpeningBalances ob ON ab.AccountId = ob.BankAccountId
    WHERE ob.DeletedFlag = 0 AND ob.IsActive = 1;

    -- 3. Add Bank Transfers (IN)
    UPDATE ab
    SET ab.Balance = ab.Balance + ISNULL(t.TotalIn, 0)
    FROM #AccountBalances ab
    INNER JOIN (
        SELECT ToAccountID, SUM(Amount) as TotalIn
        FROM NU_BankTransfers
        WHERE DeletedFlag = 0 AND IsActive = 1 AND ToAccountID IS NOT NULL
        GROUP BY ToAccountID
    ) t ON ab.AccountId = t.ToAccountID;

    -- 4. Subtract Bank Transfers (OUT)
    UPDATE ab
    SET ab.Balance = ab.Balance - ISNULL(t.TotalOut, 0)
    FROM #AccountBalances ab
    INNER JOIN (
        SELECT FromAccountID, SUM(Amount) as TotalOut
        FROM NU_BankTransfers
        WHERE DeletedFlag = 0 AND IsActive = 1 AND FromAccountID IS NOT NULL
        GROUP BY FromAccountID
    ) t ON ab.AccountId = t.FromAccountID;

    -- Output the final balances
    SELECT 
        AccountId, 
        Balance
    FROM #AccountBalances;

    DROP TABLE #AccountBalances;
END
GO
