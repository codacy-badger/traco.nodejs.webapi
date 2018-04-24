
-- Table: user
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
    `userID` CHAR(9) NOT NULL,
    `sUsername` VARCHAR(191) NOT NULL,
    `sPassword` TEXT NOT NULL,
    `cPermission` CHAR(5) NOT NULL,
    `dtSince` BIGINT NOT NULL,
    `dtLastAccess` BIGINT NULL,
    `sFirstname` VARCHAR(191) NOT NULL,
    `sLastname` VARCHAR(191) NOT NULL,
    `sEmail` VARCHAR(191) NOT NULL,
    `sPhone` VARCHAR(191) NOT NULL,
    `dtBirthday` BIGINT NULL,
    `sAddress` TEXT NOT NULL,
    `sComment` TEXT NOT NULL,
    PRIMARY KEY (`userID`),
    UNIQUE KEY (`sUsername`)
);