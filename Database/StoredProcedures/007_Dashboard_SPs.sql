USE [AccSoft]
GO

IF OBJECT_ID('NU_sp_Dashboard_GetSummary', 'P') IS NOT NULL
    DROP PROCEDURE NU_sp_Dashboard_GetSummary;
GO

CREATE PROCEDURE NU_sp_Dashboard_GetSummary
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @CashInHand DECIMAL(18,2) = 0;
    DECLARE @BankBalance DECIMAL(18,2) = 0;
    DECLARE @ActiveEvents INT = 0;
    DECLARE @Today DATE = GETDATE();

    -- Determine Current Financial Year
    DECLARE @ReportFYStartYear INT = YEAR(@Today);
    IF MONTH(@Today) < 4 SET @ReportFYStartYear = @ReportFYStartYear - 1;
    DECLARE @ReportFY NVARCHAR(20) = CAST(@ReportFYStartYear AS VARCHAR) + '-' + RIGHT(CAST(@ReportFYStartYear + 1 AS VARCHAR), 2);

    -- ==========================================
    -- 1. CASH IN HAND CALCULATION
    -- ==========================================
    DECLARE @CashLatestOBYear NVARCHAR(20);
    DECLARE @CashOpening DECIMAL(18,2) = 0;
    
    SELECT TOP 1 @CashLatestOBYear = FinancialYear, @CashOpening = ISNULL(OpeningAmount, 0)
    FROM NU_OpeningBalances
    WHERE DeletedFlag = 0 AND BalanceType = 'Cash' AND FinancialYear <= @ReportFY
    ORDER BY FinancialYear DESC;

    DECLARE @CashOBDate DATE = '1900-01-01';
    IF @CashLatestOBYear IS NOT NULL
        SET @CashOBDate = CAST(SUBSTRING(@CashLatestOBYear, 1, 4) + '-04-01' AS DATE);

    DECLARE @CashReceipts DECIMAL(18,2) = ISNULL((SELECT SUM(CashAmount) FROM NU_Receipts WHERE DeletedFlag = 0 AND ISNULL(ReceivedDate, ReceiptDate) >= @CashOBDate AND ISNULL(ReceivedDate, ReceiptDate) <= @Today), 0);
    DECLARE @CashBox DECIMAL(18,2) = ISNULL((SELECT SUM(Amount) FROM NU_BoxCollections WHERE DeletedFlag = 0 AND ConsiderForAudit = 1 AND CollectionDate >= @CashOBDate AND CollectionDate <= @Today), 0);
    DECLARE @CashGovt DECIMAL(18,2) = ISNULL((SELECT SUM(Amount) FROM NU_GovtGrants WHERE DeletedFlag = 0 AND ConsiderForAudit = 1 AND GrantDate >= @CashOBDate AND GrantDate <= @Today), 0);
    
    DECLARE @CashPayments DECIMAL(18,2) = ISNULL((SELECT SUM(DebitAmount) FROM NU_Payments WHERE PaymentMode = 'Cash' AND DeletedFlag = 0 AND PaymentDate >= @CashOBDate AND PaymentDate <= @Today), 0);
    
    -- In transfers: withdrawing from bank means adding to cash
    DECLARE @CashTransfersIn DECIMAL(18,2) = ISNULL((SELECT SUM(Amount) FROM NU_BankTransfers WHERE TransferType = 'CashWithdrawal' AND DeletedFlag = 0 AND TransferDate >= @CashOBDate AND TransferDate <= @Today), 0);
    -- Out transfers: depositing to bank means reducing cash
    DECLARE @CashTransfersOut DECIMAL(18,2) = ISNULL((SELECT SUM(Amount) FROM NU_BankTransfers WHERE TransferType = 'CashDeposit' AND DeletedFlag = 0 AND TransferDate >= @CashOBDate AND TransferDate <= @Today), 0);

    SET @CashInHand = @CashOpening + @CashReceipts + @CashBox + @CashGovt + @CashTransfersIn - @CashPayments - @CashTransfersOut;


    -- ==========================================
    -- 2. TOTAL BANK BALANCE CALCULATION
    -- ==========================================
    -- Need to sum up the opening balances for ALL bank accounts for their respective latest FYs.
    -- For simplicity on the dashboard, we sum up the bank receipts and payments, and sum up all the opening balances.
    -- To do this accurately, we should find the latest OB for each BankAccountId.
    DECLARE @BankOpening DECIMAL(18,2) = 0;
    
    SELECT @BankOpening = ISNULL(SUM(BaseOB), 0)
    FROM (
        SELECT BankAccountId, (
            SELECT TOP 1 ISNULL(OpeningAmount, 0)
            FROM NU_OpeningBalances OB2
            WHERE OB2.DeletedFlag = 0 AND OB2.BalanceType = 'Bank' AND OB2.BankAccountId = OB1.BankAccountId AND OB2.FinancialYear <= @ReportFY
            ORDER BY FinancialYear DESC
        ) AS BaseOB
        FROM (SELECT DISTINCT BankAccountId FROM NU_OpeningBalances WHERE BalanceType = 'Bank' AND DeletedFlag = 0) OB1
    ) SubQ;

    -- For transactions, we can assume the earliest Bank OB Date is the starting point for all. Or just use a standard '2020-04-01'
    -- Actually, it's safer to just calculate it per account or assume the same @CashOBDate for the organization.
    -- For this simplified dashboard query, we will use @CashOBDate as the global cut-off date since all accounts usually start in the same FY.
    DECLARE @GlobalOBDate DATE = @CashOBDate;

    DECLARE @BankReceipts DECIMAL(18,2) = ISNULL((SELECT SUM(BankAmount) FROM NU_Receipts WHERE DeletedFlag = 0 AND ISNULL(ReceivedDate, ReceiptDate) >= @GlobalOBDate AND ISNULL(ReceivedDate, ReceiptDate) <= @Today), 0);
    DECLARE @BankPayments DECIMAL(18,2) = ISNULL((SELECT SUM(DebitAmount) FROM NU_Payments WHERE PaymentMode <> 'Cash' AND DeletedFlag = 0 AND PaymentDate >= @GlobalOBDate AND PaymentDate <= @Today), 0);
    
    -- Cash Deposits are Bank Transfers IN
    DECLARE @BankTransfersIn DECIMAL(18,2) = @CashTransfersOut;
    -- Cash Withdrawals are Bank Transfers OUT
    DECLARE @BankTransfersOut DECIMAL(18,2) = @CashTransfersIn;

    SET @BankBalance = @BankOpening + @BankReceipts + @BankTransfersIn - @BankPayments - @BankTransfersOut;

    -- ==========================================
    -- 3. ACTIVE EVENTS
    -- ==========================================
    SET @ActiveEvents = ISNULL((SELECT COUNT(*) FROM NU_EventGroups WHERE IsActive = 1 AND Status = 'Active'), (SELECT COUNT(*) FROM NU_EventGroups WHERE IsActive = 1));

    -- Return Totals
    SELECT @CashInHand AS CashInHand, @BankBalance AS BankBalance, @ActiveEvents AS ActiveEvents;

    -- 4. Calculate Recent Activities
    -- Combine top receipts and payments
    SELECT TOP 5 
        Action, Details, Time, Icon, Color, ActivityDate
    FROM
    (
        SELECT 
            'Receipt Generated' AS Action,
            '₹' + CAST((ISNULL(r.CashAmount, 0) + ISNULL(r.BankAmount, 0)) AS VARCHAR) + ' from ' + ISNULL(d.DonorName, 'Donor') AS Details,
            '' AS Time,
            'add_circle' AS Icon,
            'green' AS Color,
            ISNULL(r.ReceivedDate, r.ReceiptDate) AS ActivityDate
        FROM NU_Receipts r
        LEFT JOIN NU_Donors d ON r.DonorId = d.DonorId
        WHERE r.DeletedFlag = 0

        UNION ALL

        SELECT 
            'Payment Voucher' AS Action,
            '₹' + CAST(p.DebitAmount AS VARCHAR) + ' for ' + ISNULL(c.CategoryName, ISNULL(p.Description, 'Expense')) AS Details,
            '' AS Time,
            'remove_circle' AS Icon,
            'red' AS Color,
            p.PaymentDate AS ActivityDate
        FROM NU_Payments p
        LEFT JOIN NU_Categories c ON p.ExpenseCategoryId = c.CategoryId
        WHERE p.DeletedFlag = 0
    ) AS CombinedActivities
    ORDER BY ActivityDate DESC;
    
END
GO
