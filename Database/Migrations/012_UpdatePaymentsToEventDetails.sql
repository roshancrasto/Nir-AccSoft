-- Migration to update Payments table from EventGroupId to EventKey
ALTER TABLE Payments DROP CONSTRAINT IF EXISTS FK_Payments_EventGroups;
GO

EXEC sp_rename 'Payments.EventGroupId', 'EventKey', 'COLUMN';
GO

ALTER TABLE Payments ADD CONSTRAINT FK_Payments_EventDetails FOREIGN KEY (EventKey) REFERENCES NU_EventDetails(EventKey);
GO
