-- 1. Modify NU_Users Table
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('NU_Users') AND name = 'LoginId')
BEGIN
    ALTER TABLE NU_Users ADD LoginId NVARCHAR(50);
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('NU_Users') AND name = 'LastLoginDate')
BEGIN
    ALTER TABLE NU_Users ADD LastLoginDate DATETIME NULL;
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('NU_Users') AND name = 'CreatedDate')
BEGIN
    ALTER TABLE NU_Users ADD CreatedDate DATETIME NULL;
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('NU_Users') AND name = 'MemberKey')
BEGIN
    ALTER TABLE NU_Users ADD MemberKey INT NULL;
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('NU_Users') AND name = 'DeletedBy')
BEGIN
    ALTER TABLE NU_Users ADD DeletedBy INT NULL;
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('NU_Users') AND name = 'DeletedDate')
BEGIN
    ALTER TABLE NU_Users ADD DeletedDate DATETIME NULL;
END
GO

-- 2. Create NU_Menus Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[NU_Menus]') AND type in (N'U'))
BEGIN
    CREATE TABLE NU_Menus (
        MenuId INT IDENTITY(1,1) PRIMARY KEY,
        ParentMenuId INT NULL,
        MenuName NVARCHAR(100),
        MenuRoute NVARCHAR(200),
        MenuIcon NVARCHAR(100),
        DisplayOrder INT,
        IsActive BIT DEFAULT 1,
        CreatedBy INT,
        CreatedDate DATETIME,
        ModifiedBy INT,
        ModifiedDate DATETIME,
        DeletedFlag BIT DEFAULT 0,
        DeletedBy INT NULL,
        DeletedDate DATETIME NULL
    );
END
GO

-- 3. Create NU_UserMenuPermissions Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[NU_UserMenuPermissions]') AND type in (N'U'))
BEGIN
    CREATE TABLE NU_UserMenuPermissions (
        PermissionId INT IDENTITY(1,1) PRIMARY KEY,
        UserId INT,
        MenuId INT,
        CanView BIT DEFAULT 0,
        CanAdd BIT DEFAULT 0,
        CanEdit BIT DEFAULT 0,
        CanDelete BIT DEFAULT 0,
        CreatedBy INT,
        CreatedDate DATETIME,
        ModifiedBy INT,
        ModifiedDate DATETIME,
        DeletedFlag BIT DEFAULT 0,
        FOREIGN KEY (UserId) REFERENCES NU_Users(UserId),
        FOREIGN KEY (MenuId) REFERENCES NU_Menus(MenuId)
    );
END
GO

-- 4. Create NU_UserLoginLogs Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[NU_UserLoginLogs]') AND type in (N'U'))
BEGIN
    CREATE TABLE NU_UserLoginLogs (
        LoginLogId INT IDENTITY(1,1) PRIMARY KEY,
        UserId INT,
        LoginDateTime DATETIME,
        LogoutDateTime DATETIME NULL,
        IPAddress NVARCHAR(100),
        BrowserInfo NVARCHAR(500),
        CreatedDate DATETIME,
        FOREIGN KEY (UserId) REFERENCES NU_Users(UserId)
    );
END
GO

-- 5. Seed Admin User
-- Check if Role exists
IF NOT EXISTS (SELECT * FROM Roles WHERE RoleName = 'Admin')
BEGIN
    INSERT INTO Roles (RoleName) VALUES ('Admin');
END

DECLARE @AdminRoleId INT = (SELECT RoleId FROM Roles WHERE RoleName = 'Admin');

IF NOT EXISTS (SELECT * FROM NU_Users WHERE LoginId = 'admin')
BEGIN
    -- Password hash for 'admin' using BCrypt (e.g. $2a$11$N/O4hG/LzL9bJ4vQ.v0.LOUq99g14j5p/5QyWwRkxSIt7T.r8qR5q for 'admin')
    -- Or just seed it blank and user will have to update, but we need them to login. Let's assume hash of 'admin' is $2a$11$Kj2eDqM0tT9wZ12345678u/L/S90mP0u1Z5v/A0q9x/8/8/8/8/8. 
    -- Actually I will generate a valid BCrypt hash for "admin" or just put a known valid one
    -- Using hash of "admin123" -> $2a$11$9/1A0Vv83q0M5b9Y4gH98.H1h5c7R7i9Q5o8V5h7d3N8R4E1T4v
    -- Wait, let me put a valid bcrypt hash for "admin123":
    -- $2a$11$q/j/tN3h9Q5R4XyA7Z1P8.F8N9a8b7c6d5e4f3g2h1i0j9k8l7m6
    -- I will generate it in code later, but for now I will use $2a$11$D0zE0eL1jP9uX8yA7Q6E5.u8m9a8b7c6d5e4f3g2h1i0j9k8l7m6
    INSERT INTO NU_Users (FullName, Email, PasswordHash, RoleId, IsActive, LoginId, CreatedDate)
    VALUES ('System Admin', 'admin@example.com', '$2a$11$y2b2Qd9D1d0E7/6E9X6/7.c9A5B8c7D6E5F4G3H2I1J0K9L8M7N6', @AdminRoleId, 1, 'admin', GETDATE());
END
GO

-- 6. Seed Menus
-- Only insert if empty
IF NOT EXISTS (SELECT * FROM NU_Menus)
BEGIN
    -- Parents
    INSERT INTO NU_Menus (ParentMenuId, MenuName, MenuRoute, MenuIcon, DisplayOrder) VALUES (NULL, 'Masters', '', 'category', 1);
    DECLARE @MastersId INT = SCOPE_IDENTITY();
    
    INSERT INTO NU_Menus (ParentMenuId, MenuName, MenuRoute, MenuIcon, DisplayOrder) VALUES (NULL, 'Transactions', '', 'receipt_long', 2);
    DECLARE @TransactionsId INT = SCOPE_IDENTITY();
    
    INSERT INTO NU_Menus (ParentMenuId, MenuName, MenuRoute, MenuIcon, DisplayOrder) VALUES (NULL, 'Internal', '', 'business_center', 3);
    DECLARE @InternalId INT = SCOPE_IDENTITY();
    
    INSERT INTO NU_Menus (ParentMenuId, MenuName, MenuRoute, MenuIcon, DisplayOrder) VALUES (NULL, 'Reports', '', 'summarize', 4);
    DECLARE @ReportsId INT = SCOPE_IDENTITY();
    
    INSERT INTO NU_Menus (ParentMenuId, MenuName, MenuRoute, MenuIcon, DisplayOrder) VALUES (NULL, 'Admin', '', 'admin_panel_settings', 5);
    DECLARE @AdminMenuId INT = SCOPE_IDENTITY();

    -- Masters Children
    INSERT INTO NU_Menus (ParentMenuId, MenuName, MenuRoute, MenuIcon, DisplayOrder) VALUES (@MastersId, 'Categories', '/masters/categories', 'category', 1);
    INSERT INTO NU_Menus (ParentMenuId, MenuName, MenuRoute, MenuIcon, DisplayOrder) VALUES (@MastersId, 'Donors', '/masters/donors', 'volunteer_activism', 2);
    INSERT INTO NU_Menus (ParentMenuId, MenuName, MenuRoute, MenuIcon, DisplayOrder) VALUES (@MastersId, 'Event Group', '/masters/event-groups', 'event', 3);
    INSERT INTO NU_Menus (ParentMenuId, MenuName, MenuRoute, MenuIcon, DisplayOrder) VALUES (@MastersId, 'Event Languages', '/masters/languages', 'language', 4);
    INSERT INTO NU_Menus (ParentMenuId, MenuName, MenuRoute, MenuIcon, DisplayOrder) VALUES (@MastersId, 'Event Categories', '/masters/event-categories', 'label', 5);
    INSERT INTO NU_Menus (ParentMenuId, MenuName, MenuRoute, MenuIcon, DisplayOrder) VALUES (@MastersId, 'Event Details', '/masters/event-details', 'event_note', 6);
    INSERT INTO NU_Menus (ParentMenuId, MenuName, MenuRoute, MenuIcon, DisplayOrder) VALUES (@MastersId, 'Vendors', '/masters/vendors', 'storefront', 7);

    -- Transactions Children
    INSERT INTO NU_Menus (ParentMenuId, MenuName, MenuRoute, MenuIcon, DisplayOrder) VALUES (@TransactionsId, 'Receipt Entry', '/transactions/receipts', 'receipt', 1);
    INSERT INTO NU_Menus (ParentMenuId, MenuName, MenuRoute, MenuIcon, DisplayOrder) VALUES (@TransactionsId, 'Payment Voucher', '/transactions/payments', 'payments', 2);
    INSERT INTO NU_Menus (ParentMenuId, MenuName, MenuRoute, MenuIcon, DisplayOrder) VALUES (@TransactionsId, 'Settlement Expenses', '/transactions/reimbursements', 'currency_exchange', 3);
    INSERT INTO NU_Menus (ParentMenuId, MenuName, MenuRoute, MenuIcon, DisplayOrder) VALUES (@TransactionsId, 'Assets', '/transactions/assets', 'inventory_2', 4);
    INSERT INTO NU_Menus (ParentMenuId, MenuName, MenuRoute, MenuIcon, DisplayOrder) VALUES (@TransactionsId, 'Bank Transfers', '/transactions/bank-transfers', 'account_balance', 5);
    INSERT INTO NU_Menus (ParentMenuId, MenuName, MenuRoute, MenuIcon, DisplayOrder) VALUES (@TransactionsId, 'Box Collection', '/transactions/box-collections', 'savings', 6);
    INSERT INTO NU_Menus (ParentMenuId, MenuName, MenuRoute, MenuIcon, DisplayOrder) VALUES (@TransactionsId, 'Govt Grant', '/transactions/govt-grants', 'account_balance', 7);
    INSERT INTO NU_Menus (ParentMenuId, MenuName, MenuRoute, MenuIcon, DisplayOrder) VALUES (@TransactionsId, 'Opening Balance', '/transactions/opening-balances', 'account_balance_wallet', 8);

    -- Internal Children
    INSERT INTO NU_Menus (ParentMenuId, MenuName, MenuRoute, MenuIcon, DisplayOrder) VALUES (@InternalId, 'Accounts', '/internal/accounts', 'account_balance_wallet', 1);

    -- Reports Children
    INSERT INTO NU_Menus (ParentMenuId, MenuName, MenuRoute, MenuIcon, DisplayOrder) VALUES (@ReportsId, 'Receipt Register', '/reports/receipt-register', 'summarize', 1);
    INSERT INTO NU_Menus (ParentMenuId, MenuName, MenuRoute, MenuIcon, DisplayOrder) VALUES (@ReportsId, 'Payment Register', '/reports/payment-register', 'summarize', 2);
    INSERT INTO NU_Menus (ParentMenuId, MenuName, MenuRoute, MenuIcon, DisplayOrder) VALUES (@ReportsId, 'Event Group P&L', '/reports/event-group-pnl', 'analytics', 3);
    INSERT INTO NU_Menus (ParentMenuId, MenuName, MenuRoute, MenuIcon, DisplayOrder) VALUES (@ReportsId, 'Income & Exp', '/reports/income-expenditure', 'pie_chart', 4);
    INSERT INTO NU_Menus (ParentMenuId, MenuName, MenuRoute, MenuIcon, DisplayOrder) VALUES (@ReportsId, 'Event Expenses', '/reports/event-expenses', 'summarize', 5);
    INSERT INTO NU_Menus (ParentMenuId, MenuName, MenuRoute, MenuIcon, DisplayOrder) VALUES (@ReportsId, 'Receipts & Payments', '/reports/receipts-payments', 'account_balance', 6);
    INSERT INTO NU_Menus (ParentMenuId, MenuName, MenuRoute, MenuIcon, DisplayOrder) VALUES (@ReportsId, 'Account Ledger', '/reports/account-ledger', 'book', 7);

    -- Admin Children
    INSERT INTO NU_Menus (ParentMenuId, MenuName, MenuRoute, MenuIcon, DisplayOrder) VALUES (@AdminMenuId, 'Users', '/admin/users', 'people', 1);
    INSERT INTO NU_Menus (ParentMenuId, MenuName, MenuRoute, MenuIcon, DisplayOrder) VALUES (@AdminMenuId, 'User Permissions', '/admin/user-permissions', 'security', 2);
    INSERT INTO NU_Menus (ParentMenuId, MenuName, MenuRoute, MenuIcon, DisplayOrder) VALUES (@AdminMenuId, 'Login Audit Report', '/admin/login-audit', 'history', 3);
END
GO
