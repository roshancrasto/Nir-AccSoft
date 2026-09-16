-- Seed Data for DemoProject NGO Accounting System

-- 1. Roles
INSERT INTO NU_Roles (RoleName) VALUES ('Admin');
INSERT INTO NU_Roles (RoleName) VALUES ('Accountant');
INSERT INTO NU_Roles (RoleName) VALUES ('Viewer');
GO

-- 2. Users (Password: Admin@123 - plain text hash for dev; replace with BCrypt in production)
INSERT INTO NU_Users (FullName, Email, PasswordHash, RoleId, IsActive, CreatedBy, ModifiedDate)
VALUES ('Roshan Admin', 'admin@demoproject.org', 'Admin@123', 1, 1, 1, GETDATE());
INSERT INTO NU_Users (FullName, Email, PasswordHash, RoleId, IsActive, CreatedBy, ModifiedDate)
VALUES ('Priya Sharma', 'priya@demoproject.org', 'Acc@123', 2, 1, 1, GETDATE());
INSERT INTO NU_Users (FullName, Email, PasswordHash, RoleId, IsActive, CreatedBy, ModifiedDate)
VALUES ('Karthik R', 'karthik@demoproject.org', 'View@123', 3, 1, 1, GETDATE());
GO

-- 3. Categories (Expense Categories)
INSERT INTO NU_Categories (CategoryName, IsActive, CreatedBy, ModifiedDate) VALUES ('Venue & Decoration', 1, 1, GETDATE());
INSERT INTO NU_Categories (CategoryName, IsActive, CreatedBy, ModifiedDate) VALUES ('Catering & Food', 1, 1, GETDATE());
INSERT INTO NU_Categories (CategoryName, IsActive, CreatedBy, ModifiedDate) VALUES ('Transportation', 1, 1, GETDATE());
INSERT INTO NU_Categories (CategoryName, IsActive, CreatedBy, ModifiedDate) VALUES ('Printing & Stationery', 1, 1, GETDATE());
INSERT INTO NU_Categories (CategoryName, IsActive, CreatedBy, ModifiedDate) VALUES ('Sound & Lighting', 1, 1, GETDATE());
INSERT INTO NU_Categories (CategoryName, IsActive, CreatedBy, ModifiedDate) VALUES ('Volunteer Expenses', 1, 1, GETDATE());
INSERT INTO NU_Categories (CategoryName, IsActive, CreatedBy, ModifiedDate) VALUES ('Office Rent', 1, 1, GETDATE());
INSERT INTO NU_Categories (CategoryName, IsActive, CreatedBy, ModifiedDate) VALUES ('Utilities (Electricity/Water)', 1, 1, GETDATE());
INSERT INTO NU_Categories (CategoryName, IsActive, CreatedBy, ModifiedDate) VALUES ('Staff Salary', 1, 1, GETDATE());
INSERT INTO NU_Categories (CategoryName, IsActive, CreatedBy, ModifiedDate) VALUES ('Miscellaneous', 1, 1, GETDATE());
GO

-- 4. Event Groups
INSERT INTO NU_EventGroups (EventGroupName, StartDate, EndDate, BudgetAmount, Description, Status, CreatedBy, ModifiedDate)
VALUES ('Annual Fundraiser 2025', '2025-03-15', '2025-03-16', 150000.00, 'Annual charity dinner and auction event', 'Completed', 1, GETDATE());
INSERT INTO NU_EventGroups (EventGroupName, StartDate, EndDate, BudgetAmount, Description, Status, CreatedBy, ModifiedDate)
VALUES ('Diwali Health Camp', '2025-10-20', '2025-10-22', 75000.00, 'Free medical checkup camp for the underprivileged', 'Active', 1, GETDATE());
INSERT INTO NU_EventGroups (EventGroupName, StartDate, EndDate, BudgetAmount, Description, Status, CreatedBy, ModifiedDate)
VALUES ('Education Drive 2025', '2025-06-01', '2025-08-31', 200000.00, 'School supplies and scholarship distribution program', 'Active', 1, GETDATE());
INSERT INTO NU_EventGroups (EventGroupName, StartDate, EndDate, BudgetAmount, Description, Status, CreatedBy, ModifiedDate)
VALUES ('Tree Plantation Drive', '2025-07-05', '2025-07-05', 25000.00, 'Community tree planting event', 'Planned', 1, GETDATE());
INSERT INTO NU_EventGroups (EventGroupName, StartDate, EndDate, BudgetAmount, Description, Status, CreatedBy, ModifiedDate)
VALUES ('Winter Clothing Distribution', '2025-12-10', '2025-12-15', 50000.00, 'Warm clothing distribution to homeless shelters', 'Planned', 1, GETDATE());
GO

-- 5. Donors
INSERT INTO NU_Donors (DonorName, MobileNumber, Address, PANNumber, Email, Remarks, CreatedBy, ModifiedDate)
VALUES ('Rajesh Kumar', '9876543210', '12, MG Road, Bangalore', 'ABCPK1234F', 'rajesh@gmail.com', 'Regular annual donor', 1, GETDATE());
INSERT INTO NU_Donors (DonorName, MobileNumber, Address, PANNumber, Email, Remarks, CreatedBy, ModifiedDate)
VALUES ('Sunita Devi Trust', '9988776655', '45, Anna Nagar, Chennai', 'AABCT5678G', 'sunita.trust@gmail.com', 'CSR Partner', 1, GETDATE());
INSERT INTO NU_Donors (DonorName, MobileNumber, Address, PANNumber, Email, Remarks, CreatedBy, ModifiedDate)
VALUES ('Mohammed Irfan', '8877665544', '78, Jubilee Hills, Hyderabad', 'DEFPI9012H', 'irfan.m@yahoo.com', 'First-time donor', 1, GETDATE());
INSERT INTO NU_Donors (DonorName, MobileNumber, Address, PANNumber, Email, Remarks, CreatedBy, ModifiedDate)
VALUES ('Lakshmi Narayanan', '7766554433', '23, T Nagar, Chennai', 'GHLPN3456J', 'lakshmi.n@outlook.com', 'Monthly recurring donor', 1, GETDATE());
INSERT INTO NU_Donors (DonorName, MobileNumber, Address, PANNumber, Email, Remarks, CreatedBy, ModifiedDate)
VALUES ('ABC Foundation', '9900112233', '100, Connaught Place, Delhi', 'AABCF7890K', 'info@abcfoundation.org', 'Institutional donor - Education', 1, GETDATE());
INSERT INTO NU_Donors (DonorName, MobileNumber, Address, PANNumber, Email, Remarks, CreatedBy, ModifiedDate)
VALUES ('Venkatesh Iyer', '8899001122', '56, Koramangala, Bangalore', 'HIJPV2345L', 'venky.iyer@gmail.com', 'Event sponsor', 1, GETDATE());
GO

-- 6. Vendors
INSERT INTO NU_Vendors (VendorName, ContactNumber, Address, GSTNumber, PANNumber, CategoryId, CreatedBy, ModifiedDate)
VALUES ('Sharma Caterers', '9876000111', '15, Food Street, Bangalore', '29AABCS1234F1ZP', 'AABCS1234F', 2, 1, GETDATE());
INSERT INTO NU_Vendors (VendorName, ContactNumber, Address, GSTNumber, PANNumber, CategoryId, CreatedBy, ModifiedDate)
VALUES ('Royal Decorators', '9876000222', '22, Event Plaza, Chennai', '33BBCRD5678G1ZQ', 'BBCRD5678G', 1, 1, GETDATE());
INSERT INTO NU_Vendors (VendorName, ContactNumber, Address, GSTNumber, PANNumber, CategoryId, CreatedBy, ModifiedDate)
VALUES ('FastTrack Logistics', '9876000333', '10, Transport Nagar, Hyderabad', '36CDEFL9012H1ZR', 'CDEFL9012H', 3, 1, GETDATE());
INSERT INTO NU_Vendors (VendorName, ContactNumber, Address, GSTNumber, PANNumber, CategoryId, CreatedBy, ModifiedDate)
VALUES ('PrintWorld', '9876000444', '5, Stationery Lane, Delhi', '07EFGPW3456J1ZS', 'EFGPW3456J', 4, 1, GETDATE());
INSERT INTO NU_Vendors (VendorName, ContactNumber, Address, GSTNumber, PANNumber, CategoryId, CreatedBy, ModifiedDate)
VALUES ('SoundMax Solutions', '9876000555', '88, Tech Park, Bangalore', '29GHISM7890K1ZT', 'GHISM7890K', 5, 1, GETDATE());
GO

-- 7. Receipts (Donations received)
INSERT INTO NU_Receipts (ReceiptNumber, ReceiptDate, DonorId, EventGroupKey, PaymentMode, CashAmount, BankAmount, ReferenceNumber, PANAvailable, Description, CreatedBy, ModifiedDate)
VALUES ('REC-2025-001', '2025-03-10', 1, 1, 'Cash', 10000.00, 0, NULL, 1, 'Donation for Annual Fundraiser', 1, GETDATE());
INSERT INTO NU_Receipts (ReceiptNumber, ReceiptDate, DonorId, EventGroupKey, PaymentMode, CashAmount, BankAmount, ReferenceNumber, PANAvailable, Description, CreatedBy, ModifiedDate)
VALUES ('REC-2025-002', '2025-03-12', 2, 1, 'Bank', 0, 50000.00, 'NEFT-REF-001', 1, 'CSR donation for fundraiser event', 1, GETDATE());
INSERT INTO NU_Receipts (ReceiptNumber, ReceiptDate, DonorId, EventGroupKey, PaymentMode, CashAmount, BankAmount, ReferenceNumber, PANAvailable, Description, CreatedBy, ModifiedDate)
VALUES ('REC-2025-003', '2025-03-14', 3, 1, 'Cash', 5000.00, 0, NULL, 0, 'Walk-in donation', 1, GETDATE());
INSERT INTO NU_Receipts (ReceiptNumber, ReceiptDate, DonorId, EventGroupKey, PaymentMode, CashAmount, BankAmount, ReferenceNumber, PANAvailable, Description, CreatedBy, ModifiedDate)
VALUES ('REC-2025-004', '2025-06-05', 5, 3, 'Bank', 0, 100000.00, 'RTGS-EDU-001', 1, 'Education Drive sponsorship', 1, GETDATE());
INSERT INTO NU_Receipts (ReceiptNumber, ReceiptDate, DonorId, EventGroupKey, PaymentMode, CashAmount, BankAmount, ReferenceNumber, PANAvailable, Description, CreatedBy, ModifiedDate)
VALUES ('REC-2025-005', '2025-06-10', 4, 3, 'Bank', 0, 15000.00, 'NEFT-EDU-002', 1, 'Monthly recurring donation', 1, GETDATE());
INSERT INTO NU_Receipts (ReceiptNumber, ReceiptDate, DonorId, EventGroupKey, PaymentMode, CashAmount, BankAmount, ReferenceNumber, PANAvailable, Description, CreatedBy, ModifiedDate)
VALUES ('REC-2025-006', '2025-07-01', 6, 4, 'Cash', 8000.00, 0, NULL, 1, 'Tree plantation sponsorship', 1, GETDATE());
INSERT INTO NU_Receipts (ReceiptNumber, ReceiptDate, DonorId, EventGroupKey, PaymentMode, CashAmount, BankAmount, ReferenceNumber, PANAvailable, Description, CreatedBy, ModifiedDate)
VALUES ('REC-2025-007', '2025-10-15', 1, 2, 'Bank', 0, 25000.00, 'NEFT-HC-001', 1, 'Health camp donation', 1, GETDATE());
INSERT INTO NU_Receipts (ReceiptNumber, ReceiptDate, DonorId, EventGroupKey, PaymentMode, CashAmount, BankAmount, ReferenceNumber, PANAvailable, Description, CreatedBy, ModifiedDate)
VALUES ('REC-2025-008', '2025-10-18', 4, 2, 'Cash', 3000.00, 2000.00, 'UPI-HC-002', 1, 'Health camp mixed payment', 1, GETDATE());
GO

-- 8. Payments (Expenses)
INSERT INTO NU_Payments (VoucherNumber, VoucherDate, PaymentDate, VendorId, EventGroupKey, ExpenseCategoryId, PaymentMode, DebitAmount, Description, BillAvailable, BillNumber, BillDate, ReferenceNumber, EnteredBy, VerifiedBy, CreatedBy, ModifiedDate)
VALUES ('PV-2025-001', '2025-03-10', '2025-03-10', 1, 1, 2, 'Bank', 35000.00, 'Catering for Annual Fundraiser dinner', 1, 'INV-SC-2025-101', '2025-03-08', 'NEFT-PV-001', 2, 1, 1, GETDATE());
INSERT INTO NU_Payments (VoucherNumber, VoucherDate, PaymentDate, VendorId, EventGroupKey, ExpenseCategoryId, PaymentMode, DebitAmount, Description, BillAvailable, BillNumber, BillDate, ReferenceNumber, EnteredBy, VerifiedBy, CreatedBy, ModifiedDate)
VALUES ('PV-2025-002', '2025-03-11', '2025-03-11', 2, 1, 1, 'Bank', 22000.00, 'Stage decoration and flowers', 1, 'INV-RD-2025-055', '2025-03-09', 'NEFT-PV-002', 2, 1, 1, GETDATE());
INSERT INTO NU_Payments (VoucherNumber, VoucherDate, PaymentDate, VendorId, EventGroupKey, ExpenseCategoryId, PaymentMode, DebitAmount, Description, BillAvailable, BillNumber, BillDate, ReferenceNumber, EnteredBy, VerifiedBy, CreatedBy, ModifiedDate)
VALUES ('PV-2025-003', '2025-03-12', '2025-03-12', 5, 1, 5, 'Cash', 12000.00, 'Sound system and lighting rental', 1, 'INV-SM-2025-033', '2025-03-10', NULL, 2, 1, 1, GETDATE());
INSERT INTO NU_Payments (VoucherNumber, VoucherDate, PaymentDate, VendorId, EventGroupKey, ExpenseCategoryId, PaymentMode, DebitAmount, Description, BillAvailable, BillNumber, BillDate, ReferenceNumber, EnteredBy, VerifiedBy, CreatedBy, ModifiedDate)
VALUES ('PV-2025-004', '2025-06-08', '2025-06-08', 4, 3, 4, 'Bank', 8500.00, 'Printing school notebooks and certificates', 1, 'INV-PW-2025-078', '2025-06-06', 'NEFT-PV-004', 2, 1, 1, GETDATE());
INSERT INTO NU_Payments (VoucherNumber, VoucherDate, PaymentDate, VendorId, EventGroupKey, ExpenseCategoryId, PaymentMode, DebitAmount, Description, BillAvailable, BillNumber, BillDate, ReferenceNumber, EnteredBy, VerifiedBy, CreatedBy, ModifiedDate)
VALUES ('PV-2025-005', '2025-06-15', '2025-06-15', 3, 3, 3, 'Bank', 6000.00, 'Bus transport for school visit', 1, 'INV-FT-2025-022', '2025-06-14', 'NEFT-PV-005', 2, 1, 1, GETDATE());
INSERT INTO NU_Payments (VoucherNumber, VoucherDate, PaymentDate, VendorId, EventGroupKey, ExpenseCategoryId, PaymentMode, DebitAmount, Description, BillAvailable, BillNumber, BillDate, ReferenceNumber, EnteredBy, VerifiedBy, CreatedBy, ModifiedDate)
VALUES ('PV-2025-006', '2025-07-05', '2025-07-05', NULL, 4, 6, 'Cash', 3500.00, 'Volunteer refreshments and supplies', 0, NULL, NULL, NULL, 2, 1, 1, GETDATE());
INSERT INTO NU_Payments (VoucherNumber, VoucherDate, PaymentDate, VendorId, EventGroupKey, ExpenseCategoryId, PaymentMode, DebitAmount, Description, BillAvailable, BillNumber, BillDate, ReferenceNumber, EnteredBy, VerifiedBy, CreatedBy, ModifiedDate)
VALUES ('PV-2025-007', '2025-10-18', '2025-10-18', 1, 2, 2, 'Bank', 18000.00, 'Food for health camp volunteers and patients', 1, 'INV-SC-2025-155', '2025-10-16', 'NEFT-PV-007', 2, 1, 1, GETDATE());
INSERT INTO NU_Payments (VoucherNumber, VoucherDate, PaymentDate, VendorId, EventGroupKey, ExpenseCategoryId, PaymentMode, DebitAmount, Description, BillAvailable, BillNumber, BillDate, ReferenceNumber, EnteredBy, VerifiedBy, CreatedBy, ModifiedDate)
VALUES ('PV-2025-008', '2025-01-05', '2025-01-05', NULL, NULL, 7, 'Bank', 15000.00, 'Office rent for January 2025', 1, 'RENT-JAN-2025', '2025-01-01', 'NEFT-PV-008', 2, 1, 1, GETDATE());
INSERT INTO NU_Payments (VoucherNumber, VoucherDate, PaymentDate, VendorId, EventGroupKey, ExpenseCategoryId, PaymentMode, DebitAmount, Description, BillAvailable, BillNumber, BillDate, ReferenceNumber, EnteredBy, VerifiedBy, CreatedBy, ModifiedDate)
VALUES ('PV-2025-009', '2025-01-10', '2025-01-10', NULL, NULL, 8, 'Bank', 4500.00, 'Electricity bill December 2024', 1, 'EB-DEC-2024', '2024-12-28', 'NEFT-PV-009', 2, 1, 1, GETDATE());
INSERT INTO NU_Payments (VoucherNumber, VoucherDate, PaymentDate, VendorId, EventGroupKey, ExpenseCategoryId, PaymentMode, DebitAmount, Description, BillAvailable, BillNumber, BillDate, ReferenceNumber, EnteredBy, VerifiedBy, CreatedBy, ModifiedDate)
VALUES ('PV-2025-010', '2025-01-31', '2025-01-31', NULL, NULL, 9, 'Bank', 30000.00, 'Staff salary January 2025', 0, NULL, NULL, 'NEFT-PV-010', 2, 1, 1, GETDATE());
GO

-- 9. Reimbursements
INSERT INTO NU_Reimbursements (ReimbursementNumber, ReimbursementDate, UserId, EventGroupId, ExpenseCategoryId, Amount, Description, BillAvailable, BillNumber, BillDate, Status, CreatedBy, ModifiedDate)
VALUES ('RMB-2025-001', '2025-03-16', 2, 1, 3, 1200.00, 'Auto fare for event setup', 1, 'AUTO-001', '2025-03-15', 'Approved', 2, GETDATE());
INSERT INTO NU_Reimbursements (ReimbursementNumber, ReimbursementDate, UserId, EventGroupId, ExpenseCategoryId, Amount, Description, BillAvailable, BillNumber, BillDate, Status, CreatedBy, ModifiedDate)
VALUES ('RMB-2025-002', '2025-06-20', 3, 3, 10, 800.00, 'Miscellaneous supplies for education drive', 0, NULL, NULL, 'Pending', 3, GETDATE());
INSERT INTO NU_Reimbursements (ReimbursementNumber, ReimbursementDate, UserId, EventGroupId, ExpenseCategoryId, Amount, Description, BillAvailable, BillNumber, BillDate, Status, CreatedBy, ModifiedDate)
VALUES ('RMB-2025-003', '2025-10-21', 2, 2, 6, 2500.00, 'Volunteer transport and meals for health camp', 1, 'VOL-HC-001', '2025-10-20', 'Paid', 2, GETDATE());
GO

-- 10. Assets
INSERT INTO NU_Assets (AssetNumber, AssetName, PurchaseDate, PurchaseValue, CurrentValue, DepreciationRate, Location, Condition, PaymentId, CreatedBy, ModifiedDate)
VALUES ('AST-001', 'Projector - Epson EB-X51', '2025-03-01', 45000.00, 40500.00, 10.00, 'Office Conference Room', 'Good', NULL, 1, GETDATE());
INSERT INTO NU_Assets (AssetNumber, AssetName, PurchaseDate, PurchaseValue, CurrentValue, DepreciationRate, Location, Condition, PaymentId, CreatedBy, ModifiedDate)
VALUES ('AST-002', 'PA Sound System', '2025-02-15', 28000.00, 25200.00, 10.00, 'Office Store Room', 'Good', NULL, 1, GETDATE());
INSERT INTO NU_Assets (AssetNumber, AssetName, PurchaseDate, PurchaseValue, CurrentValue, DepreciationRate, Location, Condition, PaymentId, CreatedBy, ModifiedDate)
VALUES ('AST-003', 'Office Laptop - Dell Inspiron', '2025-01-10', 55000.00, 46750.00, 15.00, 'Admin Desk', 'Good', NULL, 1, GETDATE());
INSERT INTO NU_Assets (AssetNumber, AssetName, PurchaseDate, PurchaseValue, CurrentValue, DepreciationRate, Location, Condition, PaymentId, CreatedBy, ModifiedDate)
VALUES ('AST-004', 'Office Furniture Set', '2024-06-01', 35000.00, 29750.00, 15.00, 'Office', 'Fair', NULL, 1, GETDATE());
GO

-- 11. Bank Transfers
INSERT INTO NU_BankTransfers (TransferNumber, TransferDate, FromBankAccountId, ToBankAccountId, Amount, ReferenceNumber, Description, CreatedBy, ModifiedDate)
VALUES ('BT-2025-001', '2025-03-05', 1, 2, 50000.00, 'IMPS-BT-001', 'Transfer to event account for Annual Fundraiser', 1, GETDATE());
INSERT INTO NU_BankTransfers (TransferNumber, TransferDate, FromBankAccountId, ToBankAccountId, Amount, ReferenceNumber, Description, CreatedBy, ModifiedDate)
VALUES ('BT-2025-002', '2025-06-01', 1, 2, 75000.00, 'NEFT-BT-002', 'Transfer to project account for Education Drive', 1, GETDATE());
GO

PRINT '=== Seed Data Loaded Successfully ==='
PRINT 'Roles: 3 | Users: 3 | Categories: 10 | Event Groups: 5 | Donors: 6 | Vendors: 5'
PRINT 'Receipts: 8 | Payments: 10 | Reimbursements: 3 | Assets: 4 | Bank Transfers: 2'
GO
