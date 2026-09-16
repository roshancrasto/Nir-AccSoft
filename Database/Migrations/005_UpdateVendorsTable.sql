-- Add IsActive column to Vendors table
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Vendors') AND name = 'IsActive')
BEGIN
    ALTER TABLE Vendors ADD IsActive BIT NOT NULL DEFAULT 1;
END
GO
