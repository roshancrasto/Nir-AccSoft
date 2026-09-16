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
    INSERT INTO NU_Menus (ParentMenuId, MenuName, MenuRoute, MenuIcon, DisplayOrder) VALUES (@ReportsId, 'Vouchers', '/reports/vouchers', 'receipt', 8);

    -- Admin Children
    INSERT INTO NU_Menus (ParentMenuId, MenuName, MenuRoute, MenuIcon, DisplayOrder) VALUES (@AdminMenuId, 'Users', '/admin/users', 'people', 1);
    INSERT INTO NU_Menus (ParentMenuId, MenuName, MenuRoute, MenuIcon, DisplayOrder) VALUES (@AdminMenuId, 'User Permissions', '/admin/user-permissions', 'security', 2);
    INSERT INTO NU_Menus (ParentMenuId, MenuName, MenuRoute, MenuIcon, DisplayOrder) VALUES (@AdminMenuId, 'Login Audit Report', '/admin/login-audit', 'history', 3);
END
