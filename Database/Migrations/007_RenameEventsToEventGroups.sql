-- Migration: Rename Events to EventGroups
-- Created: 2026-05-10

-- Rename the table
EXEC sp_rename 'Events', 'EventGroups';

-- Rename the columns in EventGroups
EXEC sp_rename 'EventGroups.EventId', 'EventGroupId', 'COLUMN';
EXEC sp_rename 'EventGroups.EventName', 'EventGroupName', 'COLUMN';

-- Rename EventId column in related tables
EXEC sp_rename 'Receipts.EventId', 'EventGroupId', 'COLUMN';
EXEC sp_rename 'Payments.EventId', 'EventGroupId', 'COLUMN';
EXEC sp_rename 'Reimbursements.EventId', 'EventGroupId', 'COLUMN';
