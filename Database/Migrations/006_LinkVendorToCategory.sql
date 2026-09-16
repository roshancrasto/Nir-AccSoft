-- Migration script to link Vendors to Categories
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Vendors') AND name = 'CategoryId')
BEGIN
    ALTER TABLE Vendors ADD CategoryId INT;
    
    -- Add Foreign Key constraint
    ALTER TABLE Vendors ADD CONSTRAINT FK_Vendors_Categories FOREIGN KEY (CategoryId) REFERENCES Categories(CategoryId);
END
GO

-- Drop old Category NVARCHAR column
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Vendors') AND name = 'Category')
BEGIN
    ALTER TABLE Vendors DROP COLUMN Category;
END
GO
