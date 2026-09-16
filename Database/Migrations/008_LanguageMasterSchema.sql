-- Migration Script for Language Master
CREATE TABLE [dbo].[NU_LanguageMaster](
	[LangKey] [int] IDENTITY(1,1) NOT NULL,
	[LangName] [varchar](20) NULL,
    [IsActive] [bit] DEFAULT 1,
    [DeletedFlag] [bit] DEFAULT 0,
    [CreatedBy] [int] NULL,
    [ModifiedBy] [int] NULL,
    [CreatedDate] [datetime] DEFAULT GETDATE(),
    [ModifiedDate] [datetime] DEFAULT GETDATE(),
    PRIMARY KEY CLUSTERED ([LangKey] ASC)
);
GO

-- Seed Data
SET IDENTITY_INSERT [dbo].[NU_LanguageMaster] ON;
INSERT [dbo].[NU_LanguageMaster] ([LangKey], [LangName], [IsActive], [CreatedBy]) VALUES (1, N'Konkani', 1, 1);
INSERT [dbo].[NU_LanguageMaster] ([LangKey], [LangName], [IsActive], [CreatedBy]) VALUES (2, N'English', 1, 1);
INSERT [dbo].[NU_LanguageMaster] ([LangKey], [LangName], [IsActive], [CreatedBy]) VALUES (3, N'Tulu', 1, 1);
INSERT [dbo].[NU_LanguageMaster] ([LangKey], [LangName], [IsActive], [CreatedBy]) VALUES (4, N'Kannada', 1, 1);
INSERT [dbo].[NU_LanguageMaster] ([LangKey], [LangName], [IsActive], [CreatedBy]) VALUES (5, N'Malayalam', 1, 1);
SET IDENTITY_INSERT [dbo].[NU_LanguageMaster] OFF;
GO
