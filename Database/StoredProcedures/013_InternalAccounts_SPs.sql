-- Stored Procedures for Internal Accounts (Event Expenses)
-- Created: 2026-05-11

CREATE OR ALTER PROCEDURE NU_sp_EventExpense_Insert
    @EventGroupKey INT,
    @ExpenseCode VARCHAR(50),
    @ExpenseDetails VARCHAR(100),
    @ExpenseDesc VARCHAR(500),
    @PaymentMode VARCHAR(20),
    @Amount DECIMAL(18,2),
    @CreatedBy INT
AS
BEGIN
    INSERT INTO NU_EventExpenses (EventGroupKey, ExpenseCode, ExpenseDetails, ExpenseDesc, PaymentMode, Amount, CreatedBy, CreatedDate, IsActive, DeletedFlag)
    VALUES (@EventGroupKey, @ExpenseCode, @ExpenseDetails, @ExpenseDesc, @PaymentMode, @Amount, @CreatedBy, GETDATE(), 1, 0);
    
    SELECT SCOPE_IDENTITY() AS EventExpenseKey;
END;
GO

CREATE OR ALTER PROCEDURE NU_sp_EventExpense_Update
    @EventExpenseKey INT,
    @EventGroupKey INT,
    @ExpenseCode VARCHAR(50),
    @ExpenseDetails VARCHAR(100),
    @ExpenseDesc VARCHAR(500),
    @PaymentMode VARCHAR(20),
    @Amount DECIMAL(18,2),
    @ModifiedBy INT
AS
BEGIN
    UPDATE NU_EventExpenses
    SET EventGroupKey = @EventGroupKey,
        ExpenseCode = @ExpenseCode,
        ExpenseDetails = @ExpenseDetails,
        ExpenseDesc = @ExpenseDesc,
        PaymentMode = @PaymentMode,
        Amount = @Amount,
        ModifiedBy = @ModifiedBy,
        ModifiedDate = GETDATE()
    WHERE EventExpenseKey = @EventExpenseKey;
END;
GO

CREATE OR ALTER PROCEDURE NU_sp_EventExpense_Delete
    @EventExpenseKey INT,
    @ModifiedBy INT
AS
BEGIN
    UPDATE NU_EventExpenses
    SET DeletedFlag = 1,
        ModifiedBy = @ModifiedBy,
        ModifiedDate = GETDATE()
    WHERE EventExpenseKey = @EventExpenseKey;
END;
GO

CREATE OR ALTER PROCEDURE NU_sp_EventExpense_GetById
    @EventExpenseKey INT
AS
BEGIN
    SELECT * FROM NU_EventExpenses 
    WHERE EventExpenseKey = @EventExpenseKey AND DeletedFlag = 0;
END;
GO

CREATE OR ALTER PROCEDURE NU_sp_EventExpense_GetByEventGroup
    @EventGroupKey INT
AS
BEGIN
    SELECT 
        EE.*,
        ISNULL(SUM(PEM.Amount), 0) AS PaidAmount,
        (EE.Amount - ISNULL(SUM(PEM.Amount), 0)) AS PendingAmount
    FROM NU_EventExpenses EE
    LEFT JOIN NU_PaymentExpenseMapping PEM ON EE.EventExpenseKey = PEM.EventExpenseKey AND PEM.DeletedFlag = 0
    WHERE EE.EventGroupKey = @EventGroupKey AND EE.DeletedFlag = 0
    GROUP BY EE.EventExpenseKey, EE.EventGroupKey, EE.ExpenseCode, EE.ExpenseDetails, EE.ExpenseDesc, EE.PaymentMode, EE.Amount, EE.CreatedBy, EE.CreatedDate, EE.ModifiedBy, EE.ModifiedDate, EE.IsActive, EE.DeletedFlag
    ORDER BY EE.CreatedDate DESC;
END;
GO

CREATE OR ALTER PROCEDURE NU_sp_EventGroupSummary_Get
AS
BEGIN
    WITH ExpenseTotals AS (
        SELECT 
            EventGroupKey,
            SUM(Amount) AS TotalExpenseAmount
        FROM NU_EventExpenses
        WHERE DeletedFlag = 0
        GROUP BY EventGroupKey
    ),
    PaidTotals AS (
        SELECT 
            EE.EventGroupKey,
            SUM(PEM.Amount) AS TotalPaidAmount
        FROM NU_EventExpenses EE
        INNER JOIN NU_PaymentExpenseMapping PEM ON EE.EventExpenseKey = PEM.EventExpenseKey
        WHERE EE.DeletedFlag = 0 AND PEM.DeletedFlag = 0
        GROUP BY EE.EventGroupKey
    ),
    ReceiptTotals AS (
        SELECT 
            EventGroupKey,
            SUM(ISNULL(CashAmount, 0) + ISNULL(BankAmount, 0)) AS TotalReceipts,
            SUM(CASE WHEN ISNULL(ReceiptBook_Rno, 0) > 0 THEN ISNULL(CashAmount, 0) + ISNULL(BankAmount, 0) ELSE 0 END) AS ReceiptsCreated
        FROM NU_Receipts
        WHERE DeletedFlag = 0
        GROUP BY EventGroupKey
    )
    SELECT 
        EG.EventGroupId AS EventGroupKey,
        EG.EventGroupName,
        ISNULL(ET.TotalExpenseAmount, 0) AS TotalExpenseAmount,
        ISNULL(PT.TotalPaidAmount, 0) AS PaidAmount,
        (ISNULL(ET.TotalExpenseAmount, 0) - ISNULL(PT.TotalPaidAmount, 0)) AS PendingAmount,
        ISNULL(RT.TotalReceipts, 0) AS TotalReceipts,
        ISNULL(RT.ReceiptsCreated, 0) AS ReceiptsCreated,
        (ISNULL(RT.TotalReceipts, 0) - ISNULL(RT.ReceiptsCreated, 0)) AS PendingReceipts
    FROM NU_EventGroups EG
    LEFT JOIN ExpenseTotals ET ON EG.EventGroupId = ET.EventGroupKey
    LEFT JOIN PaidTotals PT ON EG.EventGroupId = PT.EventGroupKey
    LEFT JOIN ReceiptTotals RT ON EG.EventGroupId = RT.EventGroupKey
    WHERE EG.DeletedFlag = 0
    ORDER BY EG.EventGroupName;
END;
GO
