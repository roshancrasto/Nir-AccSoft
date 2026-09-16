-- Migration: Create NU_EventExpenses table
-- Created: 2026-05-11

IF OBJECT_ID('NU_EventExpenses') IS NULL
BEGIN
    CREATE TABLE NU_EventExpenses (
        EventExpenseKey INT IDENTITY(1,1) PRIMARY KEY,
        EventGroupKey INT NOT NULL,
        -- Foreign Key reference to NU_EventGroups (which uses EventGroupId)
        ExpenseCode VARCHAR(50) NULL,
        ExpenseDetails VARCHAR(100) NULL,
        ExpenseDesc VARCHAR(500) NULL,
        PaymentMode VARCHAR(20) NULL, -- Bank, Cash
        Amount DECIMAL(18,2) NOT NULL,
        CreatedBy INT NULL,
        CreatedDate DATETIME NOT NULL DEFAULT GETDATE(),
        ModifiedBy INT NULL,
        ModifiedDate DATETIME NULL,
        DeletedFlag BIT NOT NULL DEFAULT 0,
        IsActive BIT NOT NULL DEFAULT 1,
        
        CONSTRAINT FK_EventExpenses_EventGroup FOREIGN KEY (EventGroupKey) REFERENCES NU_EventGroups(EventGroupId)
    );
    
    PRINT 'Table NU_EventExpenses created.';
END
ELSE
BEGIN
    PRINT 'Table NU_EventExpenses already exists.';
END
GO
