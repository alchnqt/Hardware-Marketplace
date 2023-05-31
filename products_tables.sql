create table Category(
	id uniqueidentifier default NEWID() PRIMARY KEY,
	name nvarchar(max),
	apiName nvarchar(max),
	
);

create table SubCategory(
	id uniqueidentifier default NEWID() PRIMARY KEY,
	name nvarchar(max),
	apiName nvarchar(max),
	image nvarchar(max),
	category_id uniqueidentifier foreign key references Category(id) on delete cascade on update cascade
);
create table SubSubCategory(
	id uniqueidentifier default NEWID() PRIMARY KEY,
	name nvarchar(max),
	apiName nvarchar(max),
	sub_category_id uniqueidentifier foreign key references SubCategory(id) on delete cascade on update cascade
);

create table Products(
	id uniqueidentifier default NEWID() PRIMARY KEY,
	api_id int,
	"key" nvarchar(max),
	name nvarchar(max),
	full_name nvarchar(max),
	name_prefix nvarchar(max),
	extended_name nvarchar(max),
	status nvarchar(max),
	imageHeader nvarchar(max),
	description nvarchar(max),
	microdescription nvarchar(max),
	price_min decimal(8,2),
	price_max decimal(8,2),
	offers int,
	sub_sub_category_id uniqueidentifier foreign key references SubSubCategory(id) on delete cascade on update cascade
);

create table ProductShop(
	id uniqueidentifier default NEWID() PRIMARY KEY,
	api_id int,
	logo nvarchar(max),
	title nvarchar(max),
	url nvarchar(max)
);

create table PositionsPrimary(
	id uniqueidentifier default NEWID() PRIMARY KEY,
	api_id nvarchar(max),
	"key" nvarchar(max),
	amount decimal(8,2),
	currency nvarchar(max),
	comment nvarchar(max),
	importer nvarchar(max),
	service_centers nvarchar(max),
	product_id_api int,
	product_id uniqueidentifier foreign key references Products(id) on delete cascade on update cascade,
	article nvarchar(max),
	manufacturer_id int,
	shop_id_api int,
	shop_id uniqueidentifier foreign key references ProductShop(id) on delete cascade on update cascade
);

create table Orders(
	id uniqueidentifier default NEWID() PRIMARY KEY,
	user_id uniqueidentifier,
	"key" uniqueidentifier,
	positions_primary_id uniqueidentifier 
	foreign key references 
	PositionsPrimary(id) on delete cascade on update cascade,
	is_completed bit, 
	order_date datetime
);

create table Reviews(
	id uniqueidentifier default NEWID() PRIMARY KEY,
	user_id uniqueidentifier,
	api_id int,
	author nvarchar(max),
	rating int,
	api_product_id nvarchar(max),
	product_id uniqueidentifier foreign key references Products(id) on delete cascade on update cascade,
	api_product_url nvarchar(max),
	pros nvarchar(max),
	cons nvarchar(max),
	summary nvarchar(max),
	"text" nvarchar(max),
	created_at datetime
);
go
create view [RowNumProducts] AS
	select RowNum, Id, [Key] from (select row_number() 
	over (order by id) as rowNum, * from Products) t2