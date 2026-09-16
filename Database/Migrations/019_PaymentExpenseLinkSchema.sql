BEGIN TRANSACTION;
BEGIN TRY

    -- 1. Create NU_PaymentExpenseLinks Table
    IF OBJECT_ID('NU_PaymentExpenseLinks') IS NULL
    BEGIN
        CREATE TABLE NU_PaymentExpenseLinks (
            ExpenseId INT IDENTITY(1,1) PRIMARY KEY,
            EventGroupKey INT NOT NULL FOREIGN KEY REFERENCES NU_EventGroups(EventGroupId),
            VendorKey INT NOT NULL FOREIGN KEY REFERENCES NU_Vendors(VendorId),
            ExpenseCategoryKey INT NOT NULL FOREIGN KEY REFERENCES NU_Categories(CategoryId),
            ExpenseDetails VARCHAR(500) NOT NULL,
            BillNo VARCHAR(100),
            BillDate DATE,
            Amount DECIMAL(18,2) NOT NULL,
            PaidByMemberKey INT NOT NULL, -- Logical FK to NU_MemberDetails
            Remarks VARCHAR(500),
            IsSettled BIT NOT NULL DEFAULT 0,
            SettledDate DATETIME NULL,
            PaymentId INT NULL, -- Logical FK to NU_Payments
            CreatedBy INT,
            CreatedDate DATETIME NOT NULL DEFAULT GETDATE(),
            ModifiedBy INT,
            ModifiedDate DATETIME,
            DeletedFlag BIT NOT NULL DEFAULT 0,
            IsActive BIT NOT NULL DEFAULT 1
        );
    END

    -- 2. Create NU_PaymentExpenseMapping Table (Optional Future Proofing)
    IF OBJECT_ID('NU_PaymentExpenseMapping_Reimburse') IS NULL
    BEGIN
        CREATE TABLE NU_PaymentExpenseMapping_Reimburse (
            MappingId INT IDENTITY(1,1) PRIMARY KEY,
            PaymentId INT NOT NULL,
            ExpenseId INT NOT NULL,
            Amount DECIMAL(18,2) NOT NULL
        );
    END

    -- 3. Alter NU_Payments Table
    IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'IsReimbursement' AND Object_ID = Object_ID('NU_Payments'))
    BEGIN
        ALTER TABLE NU_Payments ADD IsReimbursement BIT NOT NULL DEFAULT 0;
    END

    IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'MemberId' AND Object_ID = Object_ID('NU_Payments'))
    BEGIN
        ALTER TABLE NU_Payments ADD MemberId INT NULL;
    END

    COMMIT TRANSACTION;
    PRINT 'Migration 019 successful.';
END TRY
BEGIN CATCH
    ROLLBACK TRANSACTION;
    DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
    RAISERROR(@ErrorMessage, 16, 1);
END CATCH;
GO
