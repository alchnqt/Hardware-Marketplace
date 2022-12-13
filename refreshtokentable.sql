USE [TrialP_IdentityServer]
GO

/****** Object:  Table [dbo].[RefreshTokens]    Script Date: 03-Dec-22 17:24:18 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[RefreshTokens](
	[id] [uniqueidentifier] NULL,
	[UserId] [nvarchar](450) NULL,
	[token] [nvarchar](max) NULL,
	[expires] [datetime] NULL,
	[created] [datetime] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[RefreshTokens] ADD  DEFAULT (newid()) FOR [id]
GO

ALTER TABLE [dbo].[RefreshTokens]  WITH CHECK ADD FOREIGN KEY([UserId])
REFERENCES [dbo].[AspNetUsers] ([Id]) on delete cascade on update cascade
GO