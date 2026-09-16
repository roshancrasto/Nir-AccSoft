-- Create NU_BankTransfers table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[NU_BankTransfers]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[NU_BankTransfers](
        [TransferId] [int] IDENTITY(1,1) NOT NULL,
        [TransferNo] [nvarchar](50) NOT NULL,
        [TransferDate] [datetime] NOT NULL,
        [TransferType] [nvarchar](50) NOT NULL,
        [FromAccountType] [nvarchar](50) NOT NULL,
        [FromAccountID] [int] NULL,
        [ToAccountType] [nvarchar](50) NOT NULL,
        [ToAccountID] [int] NULL,
        [Amount] [decimal](18, 2) NOT NULL,
        [ReferenceNumber] [nvarchar](100) NULL,
        [Remarks] [nvarchar](max) NULL,
        [CreatedBy] [int] NULL,
        [CreatedDate] [datetime] NOT NULL DEFAULT (getdate()),
        [ModifiedBy] [int] NULL,
        [ModifiedDate] [datetime] NULL,
        [DeletedFlag] [bit] NOT NULL DEFAULT (0),
        [IsActive] [bit] NOT NULL DEFAULT (1),
        CONSTRAINT [PK_NU_BankTransfers] PRIMARY KEY CLUSTERED ([TransferId] ASC)
    )
END
GO
