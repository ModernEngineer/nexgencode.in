IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261004103544_InitialCreate'
)
BEGIN
    CREATE TABLE [AdminUsers] (
        [Id] int NOT NULL IDENTITY,
        [Username] nvarchar(64) NOT NULL,
        [PasswordHash] nvarchar(256) NOT NULL,
        [DisplayName] nvarchar(120) NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [LastLoginAt] datetime2 NULL,
        CONSTRAINT [PK_AdminUsers] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261004103544_InitialCreate'
)
BEGIN
    CREATE TABLE [ContactSubmissions] (
        [Id] int NOT NULL IDENTITY,
        [Name] nvarchar(120) NOT NULL,
        [Email] nvarchar(200) NOT NULL,
        [Phone] nvarchar(30) NULL,
        [Company] nvarchar(160) NULL,
        [Service] nvarchar(120) NULL,
        [Budget] nvarchar(40) NULL,
        [Message] nvarchar(4000) NOT NULL,
        [Status] nvarchar(20) NOT NULL,
        [AdminNotes] nvarchar(2000) NULL,
        [IpAddress] nvarchar(64) NULL,
        [CreatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_ContactSubmissions] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261004103544_InitialCreate'
)
BEGIN
    CREATE TABLE [Reviews] (
        [Id] int NOT NULL IDENTITY,
        [ClientName] nvarchar(120) NOT NULL,
        [Designation] nvarchar(120) NULL,
        [Company] nvarchar(160) NULL,
        [City] nvarchar(80) NULL,
        [Rating] int NOT NULL,
        [Comment] nvarchar(1500) NOT NULL,
        [ImageUrl] nvarchar(500) NULL,
        [IsApproved] bit NOT NULL,
        [IsFeatured] bit NOT NULL,
        [Source] nvarchar(20) NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_Reviews] PRIMARY KEY ([Id]),
        CONSTRAINT [CK_Reviews_Rating] CHECK ([Rating] BETWEEN 1 AND 5)
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261004103544_InitialCreate'
)
BEGIN
    CREATE TABLE [TeamMembers] (
        [Id] int NOT NULL IDENTITY,
        [Name] nvarchar(120) NOT NULL,
        [Title] nvarchar(120) NOT NULL,
        [Bio] nvarchar(600) NOT NULL,
        [ImageUrl] nvarchar(500) NULL,
        [LinkedInUrl] nvarchar(300) NULL,
        [Email] nvarchar(200) NULL,
        [DisplayOrder] int NOT NULL,
        [IsActive] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_TeamMembers] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261004103544_InitialCreate'
)
BEGIN
    CREATE UNIQUE INDEX [IX_AdminUsers_Username] ON [AdminUsers] ([Username]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261004103544_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_ContactSubmissions_Status_CreatedAt] ON [ContactSubmissions] ([Status], [CreatedAt]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261004103544_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Reviews_IsApproved_CreatedAt] ON [Reviews] ([IsApproved], [CreatedAt]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261004103544_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_TeamMembers_IsActive_DisplayOrder] ON [TeamMembers] ([IsActive], [DisplayOrder]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261004103544_InitialCreate'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20261004103544_InitialCreate', N'10.0.12');
END;

COMMIT;
GO

BEGIN TRANSACTION;
IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261004121922_AddProjects'
)
BEGIN
    CREATE TABLE [Projects] (
        [Id] int NOT NULL IDENTITY,
        [Title] nvarchar(160) NOT NULL,
        [Category] nvarchar(60) NOT NULL,
        [Description] nvarchar(600) NOT NULL,
        [ImageUrl] nvarchar(500) NULL,
        [Tags] nvarchar(1000) NOT NULL,
        [Url] nvarchar(500) NULL,
        [Accent] nvarchar(80) NOT NULL,
        [DisplayOrder] int NOT NULL,
        [IsActive] bit NOT NULL,
        [IsFeatured] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_Projects] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261004121922_AddProjects'
)
BEGIN
    CREATE INDEX [IX_Projects_IsActive_DisplayOrder] ON [Projects] ([IsActive], [DisplayOrder]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261004121922_AddProjects'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20261004121922_AddProjects', N'10.0.12');
END;

COMMIT;
GO

