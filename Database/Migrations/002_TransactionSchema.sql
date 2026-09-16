-- Transaction Tables Schema for Receipts and Payments

CREATE TABLE Receipts (
    ReceiptId INT PRIMARY KEY IDENTITY(1,1),
    ReceiptNumber NVARCHAR(50) NOT NULL UNIQUE,
    ReceiptDate DATE NOT NULL,
    DonorId INT FOREIGN KEY REFERENCES Donors(DonorId),
    EventId INT FOREIGN KEY REFERENCES Events(EventId),
    PaymentMode NVARCHAR(50) NOT NULL,
    CashAmount DECIMAL(18,2) NOT NULL DEFAULT 0,
    BankAmount DECIMAL(18,2) NOT NULL DEFAULT 0,
    ReferenceNumber NVARCHAR(100),
    PANAvailable BIT NOT NULL DEFAULT 0,
    Description NVARCHAR(MAX),
    CreatedBy INT,
    ModifiedBy INT,
    ModifiedDate DATETIME,
    DeletedFlag BIT NOT NULL DEFAULT 0
);

CREATE TABLE Payments (
    PaymentId INT PRIMARY KEY IDENTITY(1,1),
    VoucherNumber NVARCHAR(50) NOT NULL UNIQUE,
    VoucherDate DATE NOT NULL,
    PaymentDate DATE NOT NULL,
    VendorId INT FOREIGN KEY REFERENCES Vendors(VendorId),
    EventId INT FOREIGN KEY REFERENCES Events(EventId),
    ExpenseCategoryId INT FOREIGN KEY REFERENCES Categories(CategoryId),
    PaymentMode NVARCHAR(50) NOT NULL,
    DebitAmount DECIMAL(18,2) NOT NULL DEFAULT 0,
    Description NVARCHAR(MAX),
    BillAvailable BIT NOT NULL DEFAULT 0,
    BillNumber NVARCHAR(100),
    BillDate DATE,
    ReferenceNumber NVARCHAR(100),
    EnteredBy INT,
    VerifiedBy INT,
    AttachmentPath NVARCHAR(MAX),
    CreatedBy INT,
    ModifiedBy INT,
    ModifiedDate DATETIME,
    DeletedFlag BIT NOT NULL DEFAULT 0
);
