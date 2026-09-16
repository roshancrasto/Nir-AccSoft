-- Migration Script for Event Category Master
CREATE TABLE [dbo].[NU_EventCategoryMaster](
	[EventCatKey] [int] IDENTITY(1,1) NOT NULL,
	[EventCatName] [varchar](50) NULL,
    [IsActive] [bit] DEFAULT 1,
    [DeletedFlag] [bit] DEFAULT 0,
    [CreatedBy] [int] NULL,
    [ModifiedBy] [int] NULL,
    [CreatedDate] [datetime] DEFAULT GETDATE(),
    [ModifiedDate] [datetime] DEFAULT GETDATE(),
    PRIMARY KEY CLUSTERED ([EventCatKey] ASC)
);
GO

-- Seed Data
SET IDENTITY_INSERT [dbo].[NU_EventCategoryMaster] ON;
INSERT [dbo].[NU_EventCategoryMaster] ([EventCatKey], [EventCatName], [IsActive], [CreatedBy]) VALUES (1, N'Drama', 1, 1);
INSERT [dbo].[NU_EventCategoryMaster] ([EventCatKey], [EventCatName], [IsActive], [CreatedBy]) VALUES (2, N'Kavi Ghosti', 1, 1);
INSERT [dbo].[NU_EventCategoryMaster] ([EventCatKey], [EventCatName], [IsActive], [CreatedBy]) VALUES (3, N'Felicitation', 1, 1);
INSERT [dbo].[NU_EventCategoryMaster] ([EventCatKey], [EventCatName], [IsActive], [CreatedBy]) VALUES (4, N'Comedy Show', 1, 1);
INSERT [dbo].[NU_EventCategoryMaster] ([EventCatKey], [EventCatName], [IsActive], [CreatedBy]) VALUES (5, N'Tele Film', 1, 1);
INSERT [dbo].[NU_EventCategoryMaster] ([EventCatKey], [EventCatName], [IsActive], [CreatedBy]) VALUES (6, N'Film', 1, 1);
INSERT [dbo].[NU_EventCategoryMaster] ([EventCatKey], [EventCatName], [IsActive], [CreatedBy]) VALUES (7, N'Singing', 1, 1);
INSERT [dbo].[NU_EventCategoryMaster] ([EventCatKey], [EventCatName], [IsActive], [CreatedBy]) VALUES (8, N'Film Festival', 1, 1);
SET IDENTITY_INSERT [dbo].[NU_EventCategoryMaster] OFF;
GO
