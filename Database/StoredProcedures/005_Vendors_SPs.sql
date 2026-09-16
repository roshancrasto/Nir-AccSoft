-- Stored Procedures for Vendors

CREATE OR ALTER PROCEDURE NU_sp_Vendor_Insert
    @VendorName NVARCHAR(150),
    @ContactNumber NVARCHAR(20),
    @Address NVARCHAR(MAX),
    @GSTNumber NVARCHAR(20),
    @PANNumber NVARCHAR(20),
    @CategoryId INT,
    @CreatedBy INT
AS
BEGIN
    INSERT INTO NU_Vendors (VendorName, ContactNumber, Address, GSTNumber, PANNumber, CategoryId, IsActive, CreatedBy, ModifiedDate)
    VALUES (@VendorName, @ContactNumber, @Address, @GSTNumber, @PANNumber, @CategoryId, 1, @CreatedBy, GETDATE());
    
    SELECT SCOPE_IDENTITY() AS VendorId;
END;
GO

CREATE OR ALTER PROCEDURE NU_sp_Vendor_Update
    @VendorId INT,
    @VendorName NVARCHAR(150),
    @ContactNumber NVARCHAR(20),
    @Address NVARCHAR(MAX),
    @GSTNumber NVARCHAR(20),
    @PANNumber NVARCHAR(20),
    @CategoryId INT,
    @IsActive BIT,
    @ModifiedBy INT
AS
BEGIN
    UPDATE NU_Vendors
    SET VendorName = @VendorName,
        ContactNumber = @ContactNumber,
        Address = @Address,
        GSTNumber = @GSTNumber,
        PANNumber = @PANNumber,
        CategoryId = @CategoryId,
        IsActive = @IsActive,
        ModifiedBy = @ModifiedBy,
        ModifiedDate = GETDATE()
    WHERE VendorId = @VendorId;
END;
GO

CREATE OR ALTER PROCEDURE NU_sp_Vendor_Delete
    @VendorId INT,
    @ModifiedBy INT
AS
BEGIN
    UPDATE NU_Vendors
    SET DeletedFlag = 1,
        ModifiedBy = @ModifiedBy,
        ModifiedDate = GETDATE()
    WHERE VendorId = @VendorId;
END;
GO

CREATE OR ALTER PROCEDURE NU_sp_Vendor_GetAll
AS
BEGIN
    SELECT V.VendorId, V.VendorName, V.ContactNumber, V.Address, V.GSTNumber, V.PANNumber, V.CategoryId, C.CategoryName, V.IsActive
    FROM NU_Vendors V
    LEFT JOIN NU_Categories C ON V.CategoryId = C.CategoryId
    WHERE V.DeletedFlag = 0;
END;
GO
