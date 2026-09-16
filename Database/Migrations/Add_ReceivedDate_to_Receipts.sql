-- Add ReceivedDate column to NU_Receipts table
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[NU_Receipts]') AND name = 'ReceivedDate')
BEGIN
    ALTER TABLE [dbo].[NU_Receipts] ADD ReceivedDate DATETIME NULL;
END
GO
