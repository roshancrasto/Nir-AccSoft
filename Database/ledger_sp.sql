
CREATE PROCEDURE [dbo].[NU_sp_Report_AccountLedger] -- NU_sp_Report_AccountLedger 5,'2025-04-01','2026-08-21'
    @AccountId INT,
    @FromDate DATE,
    @ToDate DATE
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @AccountName NVARCHAR(255);
    DECLARE @AccountType VARCHAR(50);
    
    SELECT @AccountName = BankName, @AccountType = ISNULL(AccountType, 'Bank')
    FROM NU_BankAccountDetails 
    WHERE BankAccountkey = @AccountId;

    -- Determine the Financial Year of @FromDate
    DECLARE @ReportFYStartYear INT = YEAR(@FromDate);
    IF MONTH(@FromDate) < 4 SET @ReportFYStartYear = @ReportFYStartYear - 1;
    DECLARE @ReportFY NVARCHAR(20) = CAST(@ReportFYStartYear AS VARCHAR) + '-' + RIGHT(CAST(@ReportFYStartYear + 1 AS VARCHAR), 2);

    -- Find the latest Opening Balance year <= ReportFY
    DECLARE @LatestOBYear NVARCHAR(20);
    DECLARE @CalculatedOpeningBalance DECIMAL(18,2) = 0;
    DECLARE @BaseOB DECIMAL(18,2) = 0;
    
    IF @AccountType = 'Cash'
    BEGIN
        SELECT TOP 1 @LatestOBYear = FinancialYear, @BaseOB = ISNULL(OpeningAmount, 0)
        FROM NU_OpeningBalances
        WHERE DeletedFlag = 0 AND BalanceType = 'Cash' AND FinancialYear <= @ReportFY
        ORDER BY FinancialYear DESC;
    END
    ELSE
    BEGIN
        SELECT TOP 1 @LatestOBYear = FinancialYear, @BaseOB = ISNULL(OpeningAmount, 0)
        FROM NU_OpeningBalances
        WHERE DeletedFlag = 0 AND BankAccountId = @AccountId AND FinancialYear <= @ReportFY
        ORDER BY FinancialYear DESC;
    END

    DECLARE @LatestOBStartDate DATE = '1900-01-01';
    IF @LatestOBYear IS NOT NULL
    BEGIN
        SET @LatestOBStartDate = CAST(SUBSTRING(@LatestOBYear, 1, 4) + '-04-01' AS DATE);
    END

    -- Past transactions between @LatestOBStartDate and @FromDate
    DECLARE @PastReceipts DECIMAL(18,2) = 0;
    DECLARE @PastPayments DECIMAL(18,2) = 0;
    
    IF @AccountType = 'Cash'
    BEGIN
        SELECT @PastReceipts = ISNULL(SUM(CashAmount), 0) FROM NU_Receipts WHERE DeletedFlag = 0 AND ISNULL(ReceivedDate, ReceiptDate) >= @LatestOBStartDate AND ISNULL(ReceivedDate, ReceiptDate) < @FromDate;
        
        DECLARE @PastBox DECIMAL(18,2) = ISNULL((SELECT SUM(Amount) FROM NU_BoxCollections WHERE DeletedFlag = 0 AND ConsiderForAudit = 1 AND CollectionDate >= @LatestOBStartDate AND CollectionDate < @FromDate), 0);
        DECLARE @PastGovt DECIMAL(18,2) = ISNULL((SELECT SUM(Amount) FROM NU_GovtGrants WHERE DeletedFlag = 0 AND ConsiderForAudit = 1 AND GrantDate >= @LatestOBStartDate AND GrantDate < @FromDate), 0);
        
        SET @PastReceipts = @PastReceipts + @PastBox + @PastGovt;
        
        SELECT @PastPayments = ISNULL(SUM(DebitAmount), 0) FROM NU_Payments WHERE DeletedFlag = 0 AND PaymentMode = 'Cash' AND PaymentDate >= @LatestOBStartDate AND PaymentDate < @FromDate;
    END
    ELSE IF @AccountType = 'Bank'
    BEGIN
        SELECT @PastReceipts = ISNULL(SUM(BankAmount), 0) FROM NU_Receipts WHERE DeletedFlag = 0 AND ISNULL(ReceivedDate, ReceiptDate) >= @LatestOBStartDate AND ISNULL(ReceivedDate, ReceiptDate) < @FromDate;
        
        SELECT @PastPayments = ISNULL(SUM(DebitAmount), 0) FROM NU_Payments WHERE DeletedFlag = 0 AND PaymentMode IN ('Cheque', 'Online', 'Bank', 'DD') AND PaymentDate >= @LatestOBStartDate AND PaymentDate < @FromDate;
    END

    -- Past Bank Transfers between @LatestOBStartDate and @FromDate
    DECLARE @PastTransfersIn DECIMAL(18,2) = 0;
    DECLARE @PastTransfersOut DECIMAL(18,2) = 0;

    SELECT @PastTransfersIn = ISNULL(SUM(Amount), 0)
    FROM NU_BankTransfers
    WHERE DeletedFlag = 0 AND TransferDate >= @LatestOBStartDate AND TransferDate < @FromDate
      AND ToAccountID = @AccountId;

    SELECT @PastTransfersOut = ISNULL(SUM(Amount), 0)
    FROM NU_BankTransfers
    WHERE DeletedFlag = 0 AND TransferDate >= @LatestOBStartDate AND TransferDate < @FromDate
      AND FromAccountID = @AccountId;
      
    SET @CalculatedOpeningBalance = @BaseOB + @PastReceipts - @PastPayments + @PastTransfersIn - @PastTransfersOut;

    -- Ledger Transactions between @FromDate and @ToDate
    CREATE TABLE #Ledger (
        Date DATE,
        Particulars NVARCHAR(MAX),
        ReferenceNo NVARCHAR(100),
        Receipt DECIMAL(18,2) DEFAULT 0,
        Payment DECIMAL(18,2) DEFAULT 0
    );

    IF @AccountType = 'Cash'
    BEGIN
        -- Receipts
        INSERT INTO #Ledger (Date, Particulars, ReferenceNo, Receipt)
        SELECT ISNULL(r.ReceivedDate, r.ReceiptDate), 'Received from '  + ISNULL(' - ' + d.DonorName, '') + ISNULL(' - ' + r.ReceiptNumber, '')
        , r.ReceiptBook_Rno, r.CashAmount
        FROM NU_Receipts r 
        LEFT JOIN NU_Donors d ON r.DonorId = d.DonorId
        WHERE r.DeletedFlag = 0 AND r.CashAmount > 0 AND ISNULL(r.ReceivedDate, r.ReceiptDate) BETWEEN @FromDate AND @ToDate
        AND ISNULL(ReceiptBook_Rno,0) > 0
        
        -- Box Collections
        INSERT INTO #Ledger (Date, Particulars, ReferenceNo, Receipt)
        SELECT CollectionDate, 'Box Collection - ' + EventGroupName  , CollectionNumber, Amount
        FROM NU_BoxCollections  BC
        INNER JOIN NU_EventGroups EG ON BC.EventGroupKey = EG.EventGroupId 
        WHERE BC.DeletedFlag = 0 AND ConsiderForAudit = 1 AND CollectionDate BETWEEN @FromDate AND @ToDate;
        
        -- Govt Grants
        INSERT INTO #Ledger (Date, Particulars, ReferenceNo, Receipt)
        SELECT GrantDate, 'Government Grant', GrantNumber, Amount
        FROM NU_GovtGrants 
        WHERE DeletedFlag = 0 AND ConsiderForAudit = 1 AND GrantDate BETWEEN @FromDate AND @ToDate;
        
        -- Payments
        INSERT INTO #Ledger (Date, Particulars, ReferenceNo, Payment)
        SELECT p.PaymentDate, 'Paid to ' + ISNULL(' - ' + v.VendorName, '') , p.VoucherNumber, p.DebitAmount
        FROM NU_Payments p
        LEFT JOIN NU_Vendors v ON p.VendorId = v.VendorId
        WHERE p.DeletedFlag = 0 AND p.PaymentMode = 'Cash' AND PaymentType = 'Normal'
        AND p.PaymentDate BETWEEN @FromDate AND @ToDate;

        INSERT INTO #Ledger (Date, Particulars, ReferenceNo, Payment)
        SELECT p.PaymentDate, 'Paid to ' + ISNULL(' - ' + v.VendorName, '')   , p.VoucherNumber, p.DebitAmount
        FROM NU_Payments p
        INNER JOIN (SELECT DISTINCT PaymentID , VendorKey  FROM NU_PaymentExpenseLinks 
        WHERE ISNULL(DeletedFlag,0) = 0) EM ON p.PaymentId = EM.PaymentID
        LEFT JOIN NU_Vendors v ON p.VendorId = v.VendorId OR V.VendorId = VendorKey
        WHERE p.DeletedFlag = 0 AND p.PaymentMode = 'Cash' AND PaymentType = 'Multiple Payments'
        AND p.PaymentDate BETWEEN @FromDate AND @ToDate;

        INSERT INTO #Ledger (Date, Particulars, ReferenceNo, Payment)
        SELECT p.PaymentDate, 'Re-Imbursement to ' + ISNULL(' - ' + MD.MemberName , '') , p.VoucherNumber, p.DebitAmount
        FROM NU_Payments p 
        LEFT JOIN NU_MemberDetails MD ON p.MemberId = MD.MemberKey 
        LEFT JOIN NU_Vendors v ON p.VendorId = v.VendorId
        WHERE p.DeletedFlag = 0 AND p.PaymentMode = 'Cash' AND PaymentType = 'Re-Imbursement'
        AND p.PaymentDate BETWEEN @FromDate AND @ToDate;


    END
    ELSE IF @AccountType = 'Bank'
    BEGIN
        -- Receipts
        INSERT INTO #Ledger (Date, Particulars, ReferenceNo, Receipt)
        SELECT ISNULL(r.ReceivedDate, r.ReceiptDate),+ 'Received from '  + ISNULL(' - ' + d.DonorName, '') + ISNULL(' - ' + r.ReceiptNumber, '')
        , r.ReceiptBook_Rno , r.BankAmount
        FROM NU_Receipts r 
        LEFT JOIN NU_Donors d ON r.DonorId = d.DonorId
        WHERE r.DeletedFlag = 0 AND r.BankAmount > 0 AND ISNULL(r.ReceivedDate, r.ReceiptDate) BETWEEN @FromDate AND @ToDate;
        
        -- Payments
        INSERT INTO #Ledger (Date, Particulars, ReferenceNo, Payment)
        SELECT p.PaymentDate, 'Paid To' + ISNULL(' - ' + v.VendorName, '') , p.VoucherNumber, p.DebitAmount
        FROM NU_Payments p
        LEFT JOIN NU_Vendors v ON p.VendorId = v.VendorId
        WHERE p.DeletedFlag = 0 AND p.PaymentMode IN ('Cheque', 'Online', 'Bank', 'DD')  AND PaymentType = 'Normal'
        AND p.PaymentDate BETWEEN @FromDate AND @ToDate;

        INSERT INTO #Ledger (Date, Particulars, ReferenceNo, Payment)
        SELECT p.PaymentDate, 'Paid To' + ISNULL(' - ' + v.VendorName, '') , p.VoucherNumber, p.DebitAmount
        FROM NU_Payments p
        INNER JOIN (SELECT DISTINCT PaymentID , VendorKey  FROM NU_PaymentExpenseLinks 
        WHERE ISNULL(DeletedFlag,0) = 0) EM ON p.PaymentId = EM.PaymentID
        LEFT JOIN NU_Vendors v ON p.VendorId = v.VendorId OR V.VendorId = VendorKey
        WHERE p.DeletedFlag = 0 AND p.PaymentMode IN ('Cheque', 'Online', 'Bank', 'DD')   AND PaymentType = 'Multiple Payments'
        AND p.PaymentDate BETWEEN @FromDate AND @ToDate;

        INSERT INTO #Ledger (Date, Particulars, ReferenceNo, Payment)
        SELECT p.PaymentDate, 'Re-Imbursement to ' + ISNULL(' - ' + MD.MemberName , '') , p.VoucherNumber, p.DebitAmount
        FROM NU_Payments p
        LEFT JOIN NU_MemberDetails MD ON p.MemberId = MD.MemberKey 
        LEFT JOIN NU_Vendors v ON p.VendorId = v.VendorId
        WHERE p.DeletedFlag = 0 AND p.PaymentMode IN ('Cheque', 'Online', 'Bank', 'DD')   AND PaymentType = 'Re-Imbursement'
        AND p.PaymentDate BETWEEN @FromDate AND @ToDate;
    END

    -- Bank Transfers IN (Receipts)
    INSERT INTO #Ledger (Date, Particulars, ReferenceNo, Receipt)
    SELECT TransferDate, 'Transfer to  ' + ISNULL(FromAccountType, 'Account'), ISNULL(TransferNo, ''), Amount
    FROM NU_BankTransfers 
    WHERE DeletedFlag = 0 AND ToAccountID = @AccountId AND TransferDate BETWEEN @FromDate AND @ToDate;

    -- Bank Transfers OUT (Payments)
    INSERT INTO #Ledger (Date, Particulars, ReferenceNo, Payment)
    SELECT TransferDate, 'Transfer/Deposit To Badagabettu Credit Co-Op Society' , ISNULL(TransferNo, ''), Amount
    FROM NU_BankTransfers 
    WHERE DeletedFlag = 0 AND FromAccountID = @AccountId AND TransferDate BETWEEN @FromDate AND @ToDate;


    -- Result Set 1: Account Info
    SELECT 
        @AccountName AS AccountName, 
        @CalculatedOpeningBalance AS OpeningBalance, 
        @AccountType AS AccountType;

    -- Result Set 2: Transactions
    SELECT 
        Date, 
        Particulars, 
        ReferenceNo, 
        Receipt, 
        Payment,
        @CalculatedOpeningBalance + SUM(Receipt - Payment) OVER (ORDER BY Date, ReferenceNo ROWS UNBOUNDED PRECEDING) AS Balance
    FROM #Ledger
    ORDER BY Date, ReferenceNo;

    -- Result Set 3: Totals
    SELECT 
        ISNULL(SUM(Receipt), 0) AS TotalReceipts,
        ISNULL(SUM(Payment), 0) AS TotalPayments,
        @CalculatedOpeningBalance + ISNULL(SUM(Receipt), 0) - ISNULL(SUM(Payment), 0) AS ClosingBalance
    FROM #Ledger;

    DROP TABLE #Ledger;
END


(1 rows affected)
