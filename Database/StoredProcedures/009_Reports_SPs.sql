-- Stored Procedures for Reporting

-- 1. Receipt Register (Between Dates)
CREATE OR ALTER PROCEDURE [dbo].[NU_sp_Report_ReceiptRegister]
    @StartDate DATETIME,
    @EndDate DATETIME
AS
BEGIN
    SELECT 
        r.ReceiptId,
        r.ReceiptNumber,
        r.ReceiptDate,
        r.ReceivedDate,
        r.ReceiptBook_Rno,
        d.DonorName,
        eg.EventGroupName,
        r.PaymentMode,
        r.CashAmount,
        r.BankAmount,
        r.ReferenceNumber,
        r.Description
    FROM NU_Receipts r
    LEFT JOIN NU_Donors d ON r.DonorId = d.DonorId
    LEFT JOIN NU_EventGroups eg ON r.EventGroupKey = eg.EventGroupId
    WHERE r.ReceiptDate BETWEEN @StartDate AND @EndDate
    AND r.DeletedFlag = 0
    ORDER BY r.ReceiptDate DESC;
END;
GO

-- 2. Payment Register (Between Dates)
CREATE OR ALTER PROCEDURE [dbo].[NU_sp_Report_PaymentRegister]
    @StartDate DATETIME,
    @EndDate DATETIME
AS
BEGIN
    SELECT 
        p.PaymentId,
        p.VoucherNumber,
        p.PaymentDate,
        CASE WHEN p.IsReimbursement = 1 THEN m.MemberName ELSE v.VendorName END AS VendorName,
        e.EventName,
        c.CategoryName,
        p.PaymentMode,
        p.DebitAmount,
        p.Description
    FROM NU_Payments p
    LEFT JOIN NU_Vendors v ON p.VendorId = v.VendorId
    LEFT JOIN NU_MemberDetails m ON p.MemberId = m.MemberKey
    LEFT JOIN NU_EventDetails e ON p.EventKey = e.EventKey
    LEFT JOIN NU_Categories c ON p.ExpenseCategoryId = c.CategoryId
    WHERE p.PaymentDate BETWEEN @StartDate AND @EndDate
    AND p.DeletedFlag = 0
    ORDER BY p.PaymentDate DESC;
END;
GO

-- 3. Category-wise Expense Report
CREATE OR ALTER PROCEDURE [dbo].[NU_sp_Report_CategoryExpense]
    @StartDate DATETIME,
    @EndDate DATETIME
AS
BEGIN
    SELECT 
        c.CategoryName,
        SUM(p.DebitAmount) AS TotalAmount
    FROM NU_Payments p
    JOIN NU_Categories c ON p.ExpenseCategoryId = c.CategoryId
    WHERE p.PaymentDate BETWEEN @StartDate AND @EndDate
    AND p.DeletedFlag = 0
    GROUP BY c.CategoryName;
END;
GO

-- 4. Event-wise Income & Expense (P&L)
CREATE OR ALTER PROCEDURE [dbo].[NU_sp_Report_EventGroupPNL]
    @EventKey INT
AS
BEGIN
    -- Income
    SELECT 
        'Income' AS Type,
        d.DonorName AS Name,
        r.BankAmount + r.CashAmount AS Amount
    FROM NU_Receipts r
    LEFT JOIN NU_Donors d ON r.DonorId = d.DonorId
    WHERE r.EventKey = @EventKey AND r.DeletedFlag = 0;

    -- Expenditure
    SELECT 
        'Expenditure' AS Type,
        c.CategoryName AS Name,
        p.DebitAmount AS Amount
    FROM NU_Payments p
    LEFT JOIN NU_Categories c ON p.ExpenseCategoryId = c.CategoryId
    WHERE p.EventKey = @EventKey AND p.DeletedFlag = 0;

    -- Budget Info
    SELECT 
        e.EventName,
        eg.BudgetAmount
    FROM NU_EventDetails e
    LEFT JOIN NU_EventGroups eg ON e.EventGroupKey = eg.EventGroupId
    WHERE e.EventKey = @EventKey;
END;
GO

-- 5. Donor-wise Receipt Report
CREATE OR ALTER PROCEDURE [dbo].[NU_sp_Report_DonorReceipts]
    @DonorId INT
AS
BEGIN
    SELECT r.ReceiptNumber, r.ReceiptDate, eg.EventGroupName, (r.CashAmount + r.BankAmount) AS TotalAmount
    FROM NU_Receipts r
    LEFT JOIN NU_EventGroups eg ON r.EventGroupKey = eg.EventGroupId
    WHERE r.DonorId = @DonorId AND r.DeletedFlag = 0
    ORDER BY r.ReceiptDate DESC;
END;
GO

-- 6. Income and Expenditure Summary
CREATE OR ALTER PROCEDURE [dbo].[NU_sp_Report_IncomeExpenditure]
    @StartDate DATE,
    @EndDate DATE
AS
BEGIN
    SELECT 
        'Income' AS Type,
        eg.EventGroupName AS ItemName,
        SUM(r.CashAmount + r.BankAmount) AS Amount
    FROM NU_Receipts r
    LEFT JOIN NU_EventGroups eg ON r.EventGroupKey = eg.EventGroupId
    WHERE r.ReceiptDate BETWEEN @StartDate AND @EndDate AND r.DeletedFlag = 0
    GROUP BY eg.EventGroupName

    UNION ALL

    -- Exclude Reimbursements to avoid double counting
    SELECT 
        'Expenditure' AS Type,
        c.CategoryName AS ItemName,
        SUM(p.DebitAmount) AS Amount
    FROM NU_Payments p
    LEFT JOIN NU_Categories c ON p.ExpenseCategoryId = c.CategoryId
    WHERE p.PaymentDate BETWEEN @StartDate AND @EndDate AND p.DeletedFlag = 0
    AND p.IsReimbursement = 0
    GROUP BY c.CategoryName

    UNION ALL

    -- Include settled Payment Expense Links
    SELECT 
        'Expenditure' AS Type,
        c.CategoryName AS ItemName,
        SUM(el.Amount) AS Amount
    FROM NU_PaymentExpenseLinks el
    LEFT JOIN NU_Categories c ON el.ExpenseCategoryKey = c.CategoryId
    WHERE el.IsSettled = 1 AND el.SettledDate BETWEEN @StartDate AND @EndDate AND el.DeletedFlag = 0
    GROUP BY c.CategoryName;
END;
GO
