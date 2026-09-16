CREATE TABLE NU_PaymentExpenseMapping (
    PaymentExpenseMappingKey INT IDENTITY(1,1) PRIMARY KEY,
    PaymentID INT NOT NULL,
    EventExpenseKey INT NOT NULL,
    Amount DECIMAL(18,2) NOT NULL,
    CreatedBy INT NULL,
    CreatedDate DATETIME NOT NULL DEFAULT GETDATE(),
    ModifiedBy INT NULL,
    ModifiedDate DATETIME NULL,
    DeletedFlag BIT NOT NULL DEFAULT 0,
    IsActive BIT NOT NULL DEFAULT 1,
    CONSTRAINT FK_PaymentExpenseMapping_Payment FOREIGN KEY (PaymentID) REFERENCES NU_Payments(PaymentID),
    CONSTRAINT FK_PaymentExpenseMapping_EventExpense FOREIGN KEY (EventExpenseKey) REFERENCES NU_EventExpenses(EventExpenseKey)
);
GO
