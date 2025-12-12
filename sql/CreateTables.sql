use BudgetApp

create table Tags
(
    TagId        int identity
        primary key,
    UserId       nvarchar(100)  not null,
    ParentTagId  int
        constraint FK_Tags_ParentTag
            references Tags,
    TagName      nvarchar(255)  not null,
    BudgetAmount decimal(18, 2) not null
)
go

create table Transactions
(
    TransactionId   int identity
        primary key,
    UserId          nvarchar(100)            not null,
    Date            date                     not null,
    Amount          decimal(18, 2)           not null,
    MerchantDetails nvarchar(500) default '' not null,
    TagId           int
        constraint FK_Transactions_Tags
            references Tags
)
go
