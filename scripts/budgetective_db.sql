CREATE DATABASE budgetective;
GO

USE budgetective;
GO

CREATE SCHEMA [ budg ] AUTHORIZATION [ dbo ];
GO

CREATE SCHEMA [ login ] AUTHORIZATION [ dbo ];
GO

CREATE ROLE db_user;
GO

GRANT SELECT,
	INSERT,
	UPDATE,
	DELETE
	ON SCHEMA::[ budg ]
	TO db_user;
GO

GRANT SELECT,
	UPDATE
	ON SCHEMA::[ login ]
	TO db_user;
GO

CREATE ROLE anon;
GO

GRANT INSERT
	ON SCHEMA::[ login ]
	TO anon;
GO

CREATE LOGIN registeration_user
	WITH PASSWORD = '123456';
GO

CREATE USER registeration_user
FOR LOGIN registeration_user;
GO

ALTER ROLE anon ADD MEMBER registeration_user;
GO

CREATE TABLE LOGIN.users (
	username NVARCHAR(256) NOT NULL,
	password NVARCHAR(256) NOT NULL,
	active BIT NOT NULL DEFAULT((0)),
	date_created DATETIME NOT NULL DEFAULT((CURRENT_TIMESTAMP)),
	PRIMARY KEY (username)
	)

CREATE TABLE budg.wallets (
	id INT NOT NULL DEFAULT((0)),
	name NVARCHAR(500) NOT NULL,
	description NVARCHAR(3000),
	OWNER NVARCHAR(256) NOT NULL,
	amount MONEY NOT NULL DEFAULT((0)),
	date_created DATETIME NOT NULL DEFAULT((CURRENT_TIMESTAMP)),
	last_edited DATETIME,
	PRIMARY KEY (
		id,
		OWNER
		),
	FOREIGN KEY (OWNER) REFERENCES LOGIN.users(username)
	)

CREATE TABLE budg.transfers (
	sender INT NOT NULL,
	receiver INT NOT NULL,
	OWNER NVARCHAR(256) NOT NULL,
	value MONEY NOT NULL,
	date_created DATETIME NOT NULL DEFAULT((CURRENT_TIMESTAMP)),
	last_edited DATETIME,
	FOREIGN KEY (OWNER) REFERENCES LOGIN.users(username),
	FOREIGN KEY (
		sender,
		OWNER
		) REFERENCES budg.wallets(id, OWNER),
	FOREIGN KEY (
		receiver,
		OWNER
		) REFERENCES budg.wallets(id, OWNER)
	)

CREATE TABLE budg.categories (
	id INT NOT NULL DEFAULT((0)),
	name NVARCHAR(500) NOT NULL,
	OWNER NVARCHAR(256) NOT NULL,
	child_of INT NULL,
	date_created DATETIME NOT NULL DEFAULT((CURRENT_TIMESTAMP)),
	last_edited DATETIME,
	PRIMARY KEY (
		id,
		OWNER
		),
	FOREIGN KEY (OWNER) REFERENCES LOGIN.users(username),
	FOREIGN KEY (
		child_of,
		OWNER
		) REFERENCES budg.categories(id, OWNER),
	)

CREATE TABLE budg.income_sources (
	id INT NOT NULL DEFAULT((0)),
	name NVARCHAR(500) NOT NULL,
	OWNER NVARCHAR(256) NOT NULL,
	income_freq_type INT NOT NULL,
	amount MONEY NOT NULL,
	next_salary_date DATETIME,
	auto_add_next_salary BIT NOT NULL DEFAULT((0)),
	date_created DATETIME NOT NULL DEFAULT((CURRENT_TIMESTAMP)),
	last_edited DATETIME,
	PRIMARY KEY (
		id,
		OWNER
		),
	FOREIGN KEY (OWNER) REFERENCES LOGIN.users(username)
	)

CREATE TABLE budg.transactions (
	id BIGINT NOT NULL,
	OWNER NVARCHAR(256) NOT NULL,
	wallet_id INT NOT NULL,
	type INT NOT NULL,
	value MONEY NOT NULL,
	PRIMARY KEY (
		id,
		OWNER
		),
	FOREIGN KEY (OWNER) REFERENCES LOGIN.users(username),
	FOREIGN KEY (
		wallet_id,
		OWNER
		) REFERENCES budg.wallets(id, OWNER)
	)

CREATE TABLE budg.expenses (
	trans_number BIGINT NOT NULL,
	OWNER NVARCHAR(256) NOT NULL,
	category_id INT NOT NULL,
	PRIMARY KEY (
		trans_number,
		OWNER
		),
	FOREIGN KEY (OWNER) REFERENCES LOGIN.users(username),
	FOREIGN KEY (
		trans_number,
		OWNER
		) REFERENCES budg.transactions(id, OWNER),
	FOREIGN KEY (
		category_id,
		OWNER
		) REFERENCES budg.categories(id, OWNER)
	)

CREATE TABLE budg.income (
	trans_number BIGINT NOT NULL,
	OWNER NVARCHAR(256) NOT NULL,
	income_source_id INT NOT NULL,
	PRIMARY KEY (
		trans_number,
		OWNER
		),
	FOREIGN KEY (OWNER) REFERENCES LOGIN.users(username),
	FOREIGN KEY (
		trans_number,
		OWNER
		) REFERENCES budg.transactions(id, OWNER),
	FOREIGN KEY (
		income_source_id,
		OWNER
		) REFERENCES budg.income_sources(id, OWNER)
	) GO

CREATE TRIGGER LOGIN.create_db_users ON LOGIN.users
AFTER INSERT
AS
BEGIN
	DECLARE @username NVARCHAR(256),
		@password NVARCHAR(256)
	DECLARE @query_create_login NVARCHAR(2000)
	DECLARE @query_create_user NVARCHAR(2000)

	SELECT @username = username,
		@password = password
	FROM INSERTED

	SET @query_create_login = 'CREATE LOGIN ' + @username + ' WITH PASSWORD = ''' + @password + ''';'
	SET @query_create_user = 'CREATE USER ' + @username + ' FOR LOGIN ' + @username

	IF NOT EXISTS (
			SELECT *
			FROM sys.database_principals
			WHERE name = @username
			)
	BEGIN
		EXEC sp_executesql @query_create_login

		EXEC sp_executesql @query_create_user

		EXEC sp_addrolemember N'db_user',
			@username
	END;
END
GO

CREATE PROCEDURE LOGIN.user_login (
	@username NVARCHAR(256),
	@input_password NVARCHAR(256),
	@output NVARCHAR(256) OUTPUT
	)
AS
BEGIN
	DECLARE @user_password NVARCHAR(256)

	SELECT @user_password = password
	FROM LOGIN.users
	WHERE username = @username

	IF (@user_password = @input_password)
		SELECT @output = @user_password
END
GO

GRANT EXECUTE
	ON LOGIN.user_login
	TO db_user
GO


