-- Stored Procedures for Payment Expense Mapping
-- Created: 2026-05-12

CREATE OR ALTER PROCEDURE NU_sp_PaymentExpenseMapping_Insert
    @PaymentID INT,
    @EventExpenseKey INT,
    @Amount DECIMAL(18,2),
    @CreatedBy INT
AS
BEGIN
    INSERT INTO NU_PaymentExpenseMapping (PaymentID, EventExpenseKey, Amount, CreatedBy, CreatedDate, IsActive, DeletedFlag)
    VALUES (@PaymentID, @EventExpenseKey, @Amount, @CreatedBy, GETDATE(), 1, 0);
END;
GO

CREATE OR ALTER PROCEDURE NU_sp_PaymentExpenseMapping_GetByPaymentId
    @PaymentID INT
AS
BEGIN
    SELECT 
        PEM.*,
        EE.ExpenseCode,
        EE.ExpenseDetails,
        EG.EventGroupName
    FROM NU_PaymentExpenseMapping PEM
    INNER JOIN NU_EventExpenses EE ON PEM.EventExpenseKey = EE.EventExpenseKey
    INNER JOIN NU_EventGroups EG ON EE.EventGroupKey = EG.EventGroupId
    WHERE PEM.PaymentID = @PaymentID AND PEM.DeletedFlag = 0;
END;
GO

CREATE OR ALTER PROCEDURE NU_sp_PaymentExpenseMapping_DeleteByPaymentId
    @PaymentID INT,
    @ModifiedBy INT
AS
BEGIN
    UPDATE NU_PaymentExpenseMapping
    SET DeletedFlag = 1,
        ModifiedBy = @ModifiedBy,
        ModifiedDate = GETDATE()
    WHERE PaymentID = @PaymentID;
END;
GO

CREATE OR ALTER PROCEDURE NU_sp_EventExpense_GetPending
AS
BEGIN
    SELECT 
        EE.EventExpenseKey,
        EG.EventGroupName,
        EE.ExpenseCode,
        EE.ExpenseDetails,
        EE.Amount AS TotalExpenseAmount,
        ISNULL(SUM(PEM.Amount), 0) AS AllocatedAmount,
        (EE.Amount - ISNULL(SUM(PEM.Amount), 0)) AS PendingAmount
    FROM NU_EventExpenses EE
    INNER JOIN NU_EventGroups EG ON EE.EventGroupKey = EG.EventGroupId
    LEFT JOIN NU_PaymentExpenseMapping PEM ON EE.EventExpenseKey = PEM.EventExpenseKey AND PEM.DeletedFlag = 0
    WHERE EE.DeletedFlag = 0
    GROUP BY EE.EventExpenseKey, EG.EventGroupName, EE.ExpenseCode, EE.ExpenseDetails, EE.Amount
    HAVING (EE.Amount - ISNULL(SUM(PEM.Amount), 0)) > 0
    ORDER BY EG.EventGroupName, EE.ExpenseCode;
END;
GO
