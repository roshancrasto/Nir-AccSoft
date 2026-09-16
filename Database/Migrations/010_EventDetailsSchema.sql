-- Migration Script for Event Details
CREATE TABLE [dbo].[NU_EventDetails](
	[EventKey] [int] IDENTITY(1,1) NOT NULL,
	[EventCategoryKey] [int] NULL,
	[EventGroupKey] [int] NULL,
	[LanguageKey] [int] NULL,
	[EventName] [varchar](100) NULL,
	[EventDate] [datetime] NULL,
    [IsActive] [bit] DEFAULT 1,
    [DeletedFlag] [bit] DEFAULT 0,
    [CreatedBy] [int] NULL,
    [ModifiedBy] [int] NULL,
    [CreatedDate] [datetime] DEFAULT GETDATE(),
    [ModifiedDate] [datetime] DEFAULT GETDATE(),
    PRIMARY KEY CLUSTERED ([EventKey] ASC),
    CONSTRAINT FK_EventDetails_Category FOREIGN KEY (EventCategoryKey) REFERENCES NU_EventCategoryMaster(EventCatKey),
    CONSTRAINT FK_EventDetails_EventGroup FOREIGN KEY (EventGroupKey) REFERENCES EventGroups(EventGroupId),
    CONSTRAINT FK_EventDetails_Language FOREIGN KEY (LanguageKey) REFERENCES NU_LanguageMaster(LangKey)
);
GO
