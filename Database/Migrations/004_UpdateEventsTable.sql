-- Add IsActive column to Events table
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Events') AND name = 'IsActive')
BEGIN
    ALTER TABLE Events ADD IsActive BIT NOT NULL DEFAULT 1;
END
GO
