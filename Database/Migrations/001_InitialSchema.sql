-- Initial Schema Setup for DemoProject Accounting System

CREATE TABLE Roles (
    RoleId INT PRIMARY KEY IDENTITY(1,1),
    RoleName NVARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE Users (
    UserId INT PRIMARY KEY IDENTITY(1,1),
    FullName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(MAX) NOT NULL,
    RoleId INT NOT NULL FOREIGN KEY REFERENCES Roles(RoleId),
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedBy INT,
    ModifiedBy INT,
    ModifiedDate DATETIME,
    DeletedFlag BIT NOT NULL DEFAULT 0
);

CREATE TABLE Categories (
    CategoryId INT PRIMARY KEY IDENTITY(1,1),
    CategoryName NVARCHAR(100) NOT NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedBy INT,
    ModifiedBy INT,
    ModifiedDate DATETIME,
    DeletedFlag BIT NOT NULL DEFAULT 0
);

CREATE TABLE Events (
    EventId INT PRIMARY KEY IDENTITY(1,1),
    EventName NVARCHAR(200) NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    BudgetAmount DECIMAL(18,2) NOT NULL DEFAULT 0,
    Description NVARCHAR(MAX),
    Status NVARCHAR(50),
    CreatedBy INT,
    ModifiedBy INT,
    ModifiedDate DATETIME,
    DeletedFlag BIT NOT NULL DEFAULT 0
);

CREATE TABLE Donors (
    DonorId INT PRIMARY KEY IDENTITY(1,1),
    DonorName NVARCHAR(150) NOT NULL,
    MobileNumber NVARCHAR(20),
    Address NVARCHAR(MAX),
    PANNumber NVARCHAR(20),
    Email NVARCHAR(100),
    Remarks NVARCHAR(MAX),
    CreatedBy INT,
    ModifiedBy INT,
    ModifiedDate DATETIME,
    DeletedFlag BIT NOT NULL DEFAULT 0
);

CREATE TABLE Vendors (
    VendorId INT PRIMARY KEY IDENTITY(1,1),
    VendorName NVARCHAR(150) NOT NULL,
    ContactNumber NVARCHAR(20),
    Address NVARCHAR(MAX),
    GSTNumber NVARCHAR(20),
    PANNumber NVARCHAR(20),
    Category NVARCHAR(100),
    CreatedBy INT,
    ModifiedBy INT,
    ModifiedDate DATETIME,
    DeletedFlag BIT NOT NULL DEFAULT 0
);

-- Note: Further tables for Receipts, Payments, Reimbursements, Assets, and BankTransfers 
-- will be added in subsequent migration scripts.
