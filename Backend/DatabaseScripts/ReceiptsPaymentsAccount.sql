USE [AccSoft];
GO

IF OBJECT_ID('NU_sp_Report_ReceiptsPayments', 'P') IS NOT NULL
    DROP PROCEDURE NU_sp_Report_ReceiptsPayments;
GO

CREATE PROCEDURE NU_sp_Report_ReceiptsPayments
    @FinancialYear NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;

    -- Calculate Start and End Dates based on Financial Year (e.g., '2025-26')
    DECLARE @StartYear INT = CAST(SUBSTRING(@FinancialYear, 1, 4) AS INT);
    DECLARE @StartDate DATE = CAST(CAST(@StartYear AS VARCHAR) + '-04-01' AS DATE);
    DECLARE @EndDate DATE = CAST(CAST(@StartYear + 1 AS VARCHAR) + '-03-31' AS DATE);

    -- ==========================================
    -- Opening Balance Calculation
    -- ==========================================
    
    -- a. Sum of all initial Opening Balances
    DECLARE @BaseCashOB DECIMAL(18,2) = 0;
    SELECT @BaseCashOB = ISNULL(SUM(OpeningAmount), 0) FROM NU_OpeningBalances WHERE DeletedFlag = 0 AND FinancialYear <= @FinancialYear AND BalanceType = 'Cash';

    DECLARE @BaseBankOB DECIMAL(18,2) = 0;
    SELECT @BaseBankOB = ISNULL(SUM(OpeningAmount), 0) FROM NU_OpeningBalances WHERE DeletedFlag = 0 AND FinancialYear <= @FinancialYear AND BalanceType = 'Bank';

    -- b. Past Receipts before StartDate
    DECLARE @PastCashReceipts DECIMAL(18,2) = 0;
    SELECT @PastCashReceipts = 
        ISNULL((SELECT SUM(CashAmount) FROM NU_Receipts WHERE DeletedFlag = 0 AND ReceiptDate < @StartDate), 0) +
        ISNULL((SELECT SUM(Amount) FROM NU_BoxCollections WHERE DeletedFlag = 0 AND ConsiderForAudit = 1 AND CollectionDate < @StartDate), 0);

    DECLARE @PastBankReceipts DECIMAL(18,2) = 0;
    SELECT @PastBankReceipts = 
        ISNULL((SELECT SUM(BankAmount) FROM NU_Receipts WHERE DeletedFlag = 0 AND ReceiptDate < @StartDate), 0) +
        ISNULL((SELECT SUM(Amount) FROM NU_GovtGrants WHERE DeletedFlag = 0 AND ConsiderForAudit = 1 AND GrantDate < @StartDate), 0);

    -- c. Past Payments before StartDate
    DECLARE @PastCashPayments DECIMAL(18,2) = 0;
    SELECT @PastCashPayments = ISNULL((SELECT SUM(DebitAmount) FROM NU_Payments WHERE DeletedFlag = 0 AND PaymentDate < @StartDate AND PaymentMode = 'Cash'), 0);

    DECLARE @PastBankPayments DECIMAL(18,2) = 0;
    SELECT @PastBankPayments = ISNULL((SELECT SUM(DebitAmount) FROM NU_Payments WHERE DeletedFlag = 0 AND PaymentDate < @StartDate AND PaymentMode != 'Cash'), 0);

    -- d. Past Bank Transfers before StartDate
    DECLARE @PastFDToCash DECIMAL(18,2) = 0;
    SELECT @PastFDToCash = ISNULL(SUM(Amount), 0) FROM NU_BankTransfers WHERE DeletedFlag = 0 AND TransferDate < @StartDate AND FromAccountType = 'Fixed Deposit' AND ToAccountType = 'Cash';

    DECLARE @PastFDToBank DECIMAL(18,2) = 0;
    SELECT @PastFDToBank = ISNULL(SUM(Amount), 0) FROM NU_BankTransfers WHERE DeletedFlag = 0 AND TransferDate < @StartDate AND FromAccountType = 'Fixed Deposit' AND ToAccountType = 'Bank';
    
    DECLARE @PastCashToBank DECIMAL(18,2) = 0;
    SELECT @PastCashToBank = ISNULL(SUM(Amount), 0) FROM NU_BankTransfers WHERE DeletedFlag = 0 AND TransferDate < @StartDate AND FromAccountType = 'Cash' AND ToAccountType = 'Bank';
    
    DECLARE @PastBankToCash DECIMAL(18,2) = 0;
    SELECT @PastBankToCash = ISNULL(SUM(Amount), 0) FROM NU_BankTransfers WHERE DeletedFlag = 0 AND TransferDate < @StartDate AND FromAccountType = 'Bank' AND ToAccountType = 'Cash';

    DECLARE @PastBankToFD DECIMAL(18,2) = 0;
    SELECT @PastBankToFD = ISNULL(SUM(Amount), 0) FROM NU_BankTransfers WHERE DeletedFlag = 0 AND TransferDate < @StartDate AND FromAccountType = 'Bank' AND ToAccountType = 'Fixed Deposit';

    DECLARE @PastCashToFD DECIMAL(18,2) = 0;
    SELECT @PastCashToFD = ISNULL(SUM(Amount), 0) FROM NU_BankTransfers WHERE DeletedFlag = 0 AND TransferDate < @StartDate AND FromAccountType = 'Cash' AND ToAccountType = 'Fixed Deposit';

    -- Final Opening Balances
    DECLARE @OpeningCash DECIMAL(18,2) = @BaseCashOB + @PastCashReceipts - @PastCashPayments + @PastFDToCash + @PastBankToCash - @PastCashToBank - @PastCashToFD;
    DECLARE @OpeningBank DECIMAL(18,2) = @BaseBankOB + @PastBankReceipts - @PastBankPayments + @PastFDToBank + @PastCashToBank - @PastBankToCash - @PastBankToFD;


    -- ==========================================
    -- 1. RECEIPTS
    -- ==========================================
    CREATE TABLE #Receipts (
        Description NVARCHAR(100),
        Amount DECIMAL(18,2),
        DisplayOrder INT,
        IsSubItem BIT DEFAULT 0
    );

    -- Opening Balances
    INSERT INTO #Receipts (Description, Amount, DisplayOrder) VALUES ('To Opening Balance', NULL, 1);
    INSERT INTO #Receipts (Description, Amount, DisplayOrder, IsSubItem) VALUES ('Cash in hand', @OpeningCash, 2, 1);
    INSERT INTO #Receipts (Description, Amount, DisplayOrder, IsSubItem) VALUES ('Cash at Bank', @OpeningBank, 3, 1);

    -- Donations (NU_Receipts)
    INSERT INTO #Receipts (Description, Amount, DisplayOrder)
    SELECT 'To Donations', ISNULL(SUM(ISNULL(CashAmount, 0) + ISNULL(BankAmount, 0)), 0), 4
    FROM NU_Receipts
    WHERE ReceiptBook_Rno > 0 AND DeletedFlag = 0 AND ReceiptDate BETWEEN @StartDate AND @EndDate;

    -- Box Collection (NU_BoxCollections)
    INSERT INTO #Receipts (Description, Amount, DisplayOrder)
    SELECT 'To Event - Box Collections', ISNULL(SUM(Amount), 0), 5
    FROM NU_BoxCollections
    WHERE ConsiderForAudit = 1 AND DeletedFlag = 0 AND CollectionDate BETWEEN @StartDate AND @EndDate;

    -- Govt Grants (NU_GovtGrants)
    INSERT INTO #Receipts (Description, Amount, DisplayOrder)
    SELECT 'To Govt Grants', ISNULL(SUM(Amount), 0), 6
    FROM NU_GovtGrants
    WHERE ConsiderForAudit = 1 AND DeletedFlag = 0 AND GrantDate BETWEEN @StartDate AND @EndDate;

    -- FD Encashment (Transfer from FD to Bank/Cash during the year)
    INSERT INTO #Receipts (Description, Amount, DisplayOrder)
    SELECT 'To FD Encashment', ISNULL(SUM(Amount), 0), 7
    FROM NU_BankTransfers
    WHERE DeletedFlag = 0 AND TransferDate BETWEEN @StartDate AND @EndDate
      AND (FromAccountType = 'Fixed Deposit' AND ToAccountType IN ('Cash', 'Bank'))
    HAVING SUM(Amount) > 0;


    -- ==========================================
    -- 2. PAYMENTS
    -- ==========================================
    CREATE TABLE #Payments (
        Description NVARCHAR(100),
        Amount DECIMAL(18,2),
        DisplayOrder INT IDENTITY(1,1),
        IsSubItem BIT DEFAULT 0
    );

    -- Payments Grouped by Expense Category
    INSERT INTO #Payments (Description, Amount)
    SELECT 'By ' + ISNULL(c.CategoryName, 'Other Expenses'), SUM(p.DebitAmount)
    FROM NU_Payments p
    LEFT JOIN NU_Categories c ON p.ExpenseCategoryId = c.CategoryId
    WHERE p.DeletedFlag = 0 AND p.PaymentDate BETWEEN @StartDate AND @EndDate
    GROUP BY ISNULL(c.CategoryName, 'Other Expenses');

    -- Investment in FD (Transfer from Bank/Cash to FD during the year)
    INSERT INTO #Payments (Description, Amount)
    SELECT 'By Investment in Fixed Deposits', ISNULL(SUM(Amount), 0)
    FROM NU_BankTransfers
    WHERE DeletedFlag = 0 AND TransferDate BETWEEN @StartDate AND @EndDate
      AND (FromAccountType IN ('Cash', 'Bank') AND ToAccountType = 'Fixed Deposit')
    HAVING SUM(Amount) > 0;


    -- ==========================================
    -- Closing Balance Calculation
    -- ==========================================
    
    -- Current Year Receipts
    DECLARE @CurrentCashReceipts DECIMAL(18,2) = 0;
    SELECT @CurrentCashReceipts = 
        ISNULL((SELECT SUM(CashAmount) FROM NU_Receipts WHERE DeletedFlag = 0 AND ReceiptDate BETWEEN @StartDate AND @EndDate), 0) +
        ISNULL((SELECT SUM(Amount) FROM NU_BoxCollections WHERE DeletedFlag = 0 AND ConsiderForAudit = 1 AND CollectionDate BETWEEN @StartDate AND @EndDate), 0);

    DECLARE @CurrentBankReceipts DECIMAL(18,2) = 0;
    SELECT @CurrentBankReceipts = 
        ISNULL((SELECT SUM(BankAmount) FROM NU_Receipts WHERE DeletedFlag = 0 AND ReceiptDate BETWEEN @StartDate AND @EndDate), 0) +
        ISNULL((SELECT SUM(Amount) FROM NU_GovtGrants WHERE DeletedFlag = 0 AND ConsiderForAudit = 1 AND GrantDate BETWEEN @StartDate AND @EndDate), 0);

    -- Current Year Payments
    DECLARE @CurrentCashPayments DECIMAL(18,2) = 0;
    SELECT @CurrentCashPayments = ISNULL((SELECT SUM(DebitAmount) FROM NU_Payments WHERE DeletedFlag = 0 AND PaymentDate BETWEEN @StartDate AND @EndDate AND PaymentMode = 'Cash'), 0);

    DECLARE @CurrentBankPayments DECIMAL(18,2) = 0;
    SELECT @CurrentBankPayments = ISNULL((SELECT SUM(DebitAmount) FROM NU_Payments WHERE DeletedFlag = 0 AND PaymentDate BETWEEN @StartDate AND @EndDate AND PaymentMode != 'Cash'), 0);

    -- Current Year Bank Transfers
    DECLARE @CurrentFDToCash DECIMAL(18,2) = 0;
    SELECT @CurrentFDToCash = ISNULL(SUM(Amount), 0) FROM NU_BankTransfers WHERE DeletedFlag = 0 AND TransferDate BETWEEN @StartDate AND @EndDate AND FromAccountType = 'Fixed Deposit' AND ToAccountType = 'Cash';

    DECLARE @CurrentFDToBank DECIMAL(18,2) = 0;
    SELECT @CurrentFDToBank = ISNULL(SUM(Amount), 0) FROM NU_BankTransfers WHERE DeletedFlag = 0 AND TransferDate BETWEEN @StartDate AND @EndDate AND FromAccountType = 'Fixed Deposit' AND ToAccountType = 'Bank';
    
    DECLARE @CurrentCashToBank DECIMAL(18,2) = 0;
    SELECT @CurrentCashToBank = ISNULL(SUM(Amount), 0) FROM NU_BankTransfers WHERE DeletedFlag = 0 AND TransferDate BETWEEN @StartDate AND @EndDate AND FromAccountType = 'Cash' AND ToAccountType = 'Bank';
    
    DECLARE @CurrentBankToCash DECIMAL(18,2) = 0;
    SELECT @CurrentBankToCash = ISNULL(SUM(Amount), 0) FROM NU_BankTransfers WHERE DeletedFlag = 0 AND TransferDate BETWEEN @StartDate AND @EndDate AND FromAccountType = 'Bank' AND ToAccountType = 'Cash';

    DECLARE @CurrentBankToFD DECIMAL(18,2) = 0;
    SELECT @CurrentBankToFD = ISNULL(SUM(Amount), 0) FROM NU_BankTransfers WHERE DeletedFlag = 0 AND TransferDate BETWEEN @StartDate AND @EndDate AND FromAccountType = 'Bank' AND ToAccountType = 'Fixed Deposit';

    DECLARE @CurrentCashToFD DECIMAL(18,2) = 0;
    SELECT @CurrentCashToFD = ISNULL(SUM(Amount), 0) FROM NU_BankTransfers WHERE DeletedFlag = 0 AND TransferDate BETWEEN @StartDate AND @EndDate AND FromAccountType = 'Cash' AND ToAccountType = 'Fixed Deposit';

    -- Closing Balances
    DECLARE @ClosingCash DECIMAL(18,2) = @OpeningCash + @CurrentCashReceipts - @CurrentCashPayments + @CurrentFDToCash + @CurrentBankToCash - @CurrentCashToBank - @CurrentCashToFD;
    DECLARE @ClosingBank DECIMAL(18,2) = @OpeningBank + @CurrentBankReceipts - @CurrentBankPayments + @CurrentFDToBank + @CurrentCashToBank - @CurrentBankToCash - @CurrentBankToFD;


    -- Add Closing Balance to Payments side
    INSERT INTO #Payments (Description, Amount, IsSubItem) VALUES ('By Closing Balance', NULL, 0);
    INSERT INTO #Payments (Description, Amount, IsSubItem) VALUES ('Cash in hand', @ClosingCash, 1);
    INSERT INTO #Payments (Description, Amount, IsSubItem) VALUES ('Cash at Bank', @ClosingBank, 1);


    -- ==========================================
    -- Calculate Totals
    -- ==========================================
    -- Sum of receipts (ignoring null wrapper rows)
    DECLARE @TotalReceipts DECIMAL(18,2) = (SELECT ISNULL(SUM(Amount), 0) FROM #Receipts);
    -- Sum of payments (ignoring null wrapper rows)
    DECLARE @TotalPayments DECIMAL(18,2) = (SELECT ISNULL(SUM(Amount), 0) FROM #Payments);

    -- Return 1: Receipts
    SELECT Description, Amount, IsSubItem FROM #Receipts ORDER BY DisplayOrder;

    -- Return 2: Payments
    SELECT Description, Amount, IsSubItem FROM #Payments ORDER BY DisplayOrder;

    -- Return 3: Summary Totals
    SELECT 
        @TotalReceipts AS TotalReceipts, 
        @TotalPayments AS TotalPayments, -- without closing balance
        (@ClosingCash + @ClosingBank) AS ClosingBalance,
        @TotalReceipts AS FinalTotal -- Both sides tally
        
    DROP TABLE #Receipts;
    DROP TABLE #Payments;
END
GO
