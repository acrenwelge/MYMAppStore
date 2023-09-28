-- V1
-- written from SRS on 9/26/23

set @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
set @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
set @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

drop schema if exists mymathapps;

create schema if not exists mymathapps;
use mymathapps;

-- drop tables if they exist
drop table if exists mymathapps.class;
drop table if exists mymathapps.user;
drop table if exists mymathapps.transaction;
drop table if exists mymathapps.subscription;
drop table if exists mymathapps.transaction_detail;
drop table if exists mymathapps.purchase_code;
drop table if exists mymathapps.item;
drop table if exists mymathapps.free_subscription;

-- create tables
create table if not exists mymathapps.user (
	user_id INT not null auto_increment,
	email_address VARCHAR(255) not null,
	activated_account BOOL not null,
	activation_code VARCHAR(255) not null,
	created_at DATETIME default CURRENT_TIMESTAMP,
	updated_at DATETIME on update CURRENT_TIMESTAMP,
	firstName VARCHAR(255) not null,
	lastName VARCHAR(255) not null,
	user_pw_hash VARCHAR(255) not null,
	role VARCHAR(255) not null,
	class_id INT,
	primary key (user_id),
	constraint class_id foreign key (class_id)
		references mymathapps.class(class_id)
		on delete restrict on update restrict,
	unique(email_address)
);

create table if not exists mymathapps.class (
	class_id INT not null auto_increment,
	instructor_id INT not null,
	primary key (class_id),
	constraint instructor_id foreign key (instructor_id) 
		references mymathapps.user(user_id)
		on delete restrict on update restrict
);


create table if not exists mymathapps.transaction (
	transaction_id INT not null auto_increment,
	user_id INT not null,
	total INT not null,
	created_at DATETIME default CURRENT_TIMESTAMP,
	primary key (transaction_id),
	constraint user_id foreign key (user_id)
		references mymathapps.user(user_id)
		on delete restrict on update restrict
);

create table if not exists mymathapps.subscription (
	subscription_id INT not null auto_increment,
	expirationDate DATETIME not null,
	item_id INT not null,
	user_id INT not null,
	primary key (subscription_id),
	constraint sub_user_id foreign key (user_id)
		references mymathapps.user(user_id)
		on delete restrict on update restrict,
	constraint item_id foreign key (item_id)
		references mymathapps.item(item_id)
		on delete restrict on update restrict
);

create table if not exists mymathapps.transaction_detail (
	transaction_detail_id INT not null auto_increment,
	finalPrice INT not null,
	item_id INT not null,
	transaction_id INT not null,
	purchaseCode_name VARCHAR(255) not null,
	primary key (transaction_detail_id),
	constraint trans_item_id foreign key (item_id)
		references mymathapps.item(item_id)
		on delete restrict on update restrict,
	constraint transaction_id foreign key (transaction_id)
		references mymathapps.transaction(transaction_id)
		on delete restrict on update restrict,
	constraint purchaseCode_name foreign key (purchaseCode_name)
		references mymathapps.purchase_code(name)
		on delete restrict on update restrict
);

create table if not exists mymathapps.purchase_code (
	name VARCHAR(255) not null,
	salePrice INT not null,
	item_id INT not null,
	primary key (name),
	constraint pc_item_id foreign key (item_id)
		references mymathapps.item(item_id)
		on delete restrict on update restrict
);

create table if not exists mymathapps.item (
	item_id INT not null auto_increment,
	name VARCHAR(255) not null,
	price INT not null,
	subscriptionLengthMonths INT not null,
	primary key (item_id)
);

create table if not exists mymathapps.free_subscription (
	email_subscription_id INT not null auto_increment,
	suffic VARCHAR(255) not null,
	primary key (email_subscription_id)
);

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;