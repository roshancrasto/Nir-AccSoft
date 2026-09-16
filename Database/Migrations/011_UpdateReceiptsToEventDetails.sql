-- Migration to update Receipts table from EventGroupId to EventKey
ALTER TABLE Receipts DROP CONSTRAINT IF EXISTS FK_Receipts_EventGroups;
GO

EXEC sp_rename 'Receipts.EventGroupId', 'EventKey', 'COLUMN';
GO

ALTER TABLE Receipts ADD CONSTRAINT FK_Receipts_EventDetails FOREIGN KEY (EventKey) REFERENCES NU_EventDetails(EventKey);
GO
