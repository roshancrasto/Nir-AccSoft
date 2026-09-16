-- Transaction Tables Schema for Reimbursements, Assets, and Bank Transfers

CREATE TABLE Reimbursements (
    ReimbursementId INT PRIMARY KEY IDENTITY(1,1),
    ReimbursementNumber NVARCHAR(50) NOT NULL UNIQUE,
    ReimbursementDate DATE NOT NULL,
    UserId INT FOREIGN KEY REFERENCES Users(UserId),
    EventId INT FOREIGN KEY REFERENCES Events(EventId),
    ExpenseCategoryId INT FOREIGN KEY REFERENCES Categories(CategoryId),
    Amount DECIMAL(18,2) NOT NULL DEFAULT 0,
    Description NVARCHAR(MAX),
    BillAvailable BIT NOT NULL DEFAULT 0,
    BillNumber NVARCHAR(100),
    BillDate DATE,
    AttachmentPath NVARCHAR(MAX),
    Status NVARCHAR(50) DEFAULT 'Pending', -- Pending, Approved, Rejected, Paid
    ApprovedBy INT,
    PaidDate DATE,
    CreatedBy INT,
    ModifiedBy INT,
    ModifiedDate DATETIME,
    DeletedFlag BIT NOT NULL DEFAULT 0
);

CREATE TABLE Assets (
    AssetId INT PRIMARY KEY IDENTITY(1,1),
    AssetNumber NVARCHAR(50) NOT NULL UNIQUE,
    AssetName NVARCHAR(200) NOT NULL,
    PurchaseDate DATE NOT NULL,
    PurchaseValue DECIMAL(18,2) NOT NULL DEFAULT 0,
    CurrentValue DECIMAL(18,2) NOT NULL DEFAULT 0,
    DepreciationRate DECIMAL(5,2),
    Location NVARCHAR(200),
    Condition NVARCHAR(50),
    PaymentId INT FOREIGN KEY REFERENCES Payments(PaymentId), -- Link to purchase voucher if any
    CreatedBy INT,
    ModifiedBy INT,
    ModifiedDate DATETIME,
    DeletedFlag BIT NOT NULL DEFAULT 0
);

CREATE TABLE BankTransfers (
    TransferId INT PRIMARY KEY IDENTITY(1,1),
    TransferNumber NVARCHAR(50) NOT NULL UNIQUE,
    TransferDate DATE NOT NULL,
    FromBankAccountId INT, -- Simplified, could link to a BankAccounts table
    ToBankAccountId INT,
    Amount DECIMAL(18,2) NOT NULL DEFAULT 0,
    ReferenceNumber NVARCHAR(100),
    Description NVARCHAR(MAX),
    CreatedBy INT,
    ModifiedBy INT,
    ModifiedDate DATETIME,
    DeletedFlag BIT NOT NULL DEFAULT 0
);
