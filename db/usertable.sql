drop table if exists `user`;

create table `user` (
    `userID` char(9) not null,
    `sUsername` varchar(191) not null,
    `sPassword` text not null,
    `cPermission` char(5) not null,
    `dtSince` bigint not null,
    `dtLastAccess` bigint null,
    `sFirstname` varchar(191) not null,
    `sLastname` varchar(191) not null,
    `sEmail` varchar(191) not null,
    `sPhone` varchar(191) not null,
    `dtBirthday` bigint null,
    `sAddress` text not null,
    `sComment` text not null,
    primary key (`userID`),
    unique key (`sUsername`)
);