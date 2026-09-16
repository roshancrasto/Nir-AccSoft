-- Migration script to standardize NU_ prefix
BEGIN TRANSACTION;
BEGIN TRY
    -- 1. Rename Tables
    IF OBJECT_ID('EventGroups') IS NOT NULL AND OBJECT_ID('NU_EventGroups') IS NULL
        EXEC sp_rename 'EventGroups', 'NU_EventGroups';
    IF OBJECT_ID('Assets') IS NOT NULL AND OBJECT_ID('NU_Assets') IS NULL
        EXEC sp_rename 'Assets', 'NU_Assets';
    IF OBJECT_ID('BankTransfers') IS NOT NULL AND OBJECT_ID('NU_BankTransfers') IS NULL
        EXEC sp_rename 'BankTransfers', 'NU_BankTransfers';
    IF OBJECT_ID('Categories') IS NOT NULL AND OBJECT_ID('NU_Categories') IS NULL
        EXEC sp_rename 'Categories', 'NU_Categories';
    IF OBJECT_ID('Donors') IS NOT NULL AND OBJECT_ID('NU_Donors') IS NULL
        EXEC sp_rename 'Donors', 'NU_Donors';
    IF OBJECT_ID('Payments') IS NOT NULL AND OBJECT_ID('NU_Payments') IS NULL
        EXEC sp_rename 'Payments', 'NU_Payments';
    IF OBJECT_ID('Receipts') IS NOT NULL AND OBJECT_ID('NU_Receipts') IS NULL
        EXEC sp_rename 'Receipts', 'NU_Receipts';
    IF OBJECT_ID('Reimbursements') IS NOT NULL AND OBJECT_ID('NU_Reimbursements') IS NULL
        EXEC sp_rename 'Reimbursements', 'NU_Reimbursements';
    IF OBJECT_ID('Roles') IS NOT NULL AND OBJECT_ID('NU_Roles') IS NULL
        EXEC sp_rename 'Roles', 'NU_Roles';
    IF OBJECT_ID('Users') IS NOT NULL AND OBJECT_ID('NU_Users') IS NULL
        EXEC sp_rename 'Users', 'NU_Users';
    IF OBJECT_ID('Vendors') IS NOT NULL AND OBJECT_ID('NU_Vendors') IS NULL
        EXEC sp_rename 'Vendors', 'NU_Vendors';

    -- 2. Rename Stored Procedures
    DECLARE @OldName NVARCHAR(256), @NewName NVARCHAR(256);
    DECLARE sp_cursor CURSOR FOR
    SELECT name FROM sys.procedures 
    WHERE name NOT LIKE 'NU_%' AND is_ms_shipped = 0;

    OPEN sp_cursor;
    FETCH NEXT FROM sp_cursor INTO @OldName;
    WHILE @@FETCH_STATUS = 0
    BEGIN
        SET @NewName = 'NU_' + @OldName;
        IF OBJECT_ID(@NewName) IS NULL
        BEGIN
            EXEC sp_rename @OldName, @NewName;
        END
        FETCH NEXT FROM sp_cursor INTO @OldName;
    END;
    CLOSE sp_cursor;
    DEALLOCATE sp_cursor;

    COMMIT TRANSACTION;
    PRINT 'Migration successful.';
END TRY
BEGIN CATCH
    ROLLBACK TRANSACTION;
    DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
    RAISERROR(@ErrorMessage, 16, 1);
END CATCH;
GO
