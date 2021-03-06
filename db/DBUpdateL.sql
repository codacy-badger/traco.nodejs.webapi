/********************************\
|                                |
|   Dokument every update since  |
|   last leer.tar.xz and         |
|   last demo.tar.xz update      |
|                                |
\********************************/


-- add one char to permissions
ALTER TABLE `member` MODIFY COLUMN `cPermission` CHAR(2) NOT NULL;
UPDATE `member` SET `cPermission` = CONCAT(`cPermission`, "0");

-- 180430: add one char to members permissions
ALTER TABLE `member` MODIFY COLUMN `cPermission` CHAR(3) NOT NULL;
UPDATE `member` SET `cPermission` = CONCAT(`cPermission`, "0");

-- 180430: Add bIntern to project table
ALTER TABLE `project` ADD `bIntern` BOOLEAN NOT NULL;
UPDATE `project` SET `bIntern` = 0;

-- 180430: add one char to members permissions
ALTER TABLE `member` MODIFY COLUMN `cPermission` CHAR(4) NOT NULL;
UPDATE `member` SET `cPermission` = CONCAT(`cPermission`, "0");

-- 180430: add one char to members permissions
ALTER TABLE `member` MODIFY COLUMN `cPermission` CHAR(5) NOT NULL;
UPDATE `member` SET `cPermission` = CONCAT(`cPermission`, "0");

-- 180430: add one char to members permissions
ALTER TABLE `member` MODIFY COLUMN `cPermission` CHAR(6) NOT NULL;
UPDATE `member` SET `cPermission` = CONCAT(`cPermission`, "0");

-- 180430: add one char to members permissions
ALTER TABLE `member` MODIFY COLUMN `cPermission` CHAR(7) NOT NULL;
UPDATE `member` SET `cPermission` = CONCAT(`cPermission`, "0");

-- 180501: correct name of bIntern in tasktype
ALTER TABLE `tasktype` CHANGE `bInten` `bIntern` BOOLEAN NOT NULL;

-- 180501: add one char to members permissions
ALTER TABLE `member` MODIFY COLUMN `cPermission` CHAR(8) NOT NULL;
UPDATE `member` SET `cPermission` = CONCAT(`cPermission`, "0");

-- 180501: add one char to members permissions
ALTER TABLE `member` MODIFY COLUMN `cPermission` CHAR(9) NOT NULL;
UPDATE `member` SET `cPermission` = CONCAT(`cPermission`, "0");

-- 180501: add one char to members permissions
ALTER TABLE `member` MODIFY COLUMN `cPermission` CHAR(10) NOT NULL;
UPDATE `member` SET `cPermission` = CONCAT(`cPermission`, "0");

-- 180501: add one char to members permissions
ALTER TABLE `member` MODIFY COLUMN `cPermission` CHAR(11) NOT NULL;
UPDATE `member` SET `cPermission` = CONCAT(`cPermission`, "0");

-- 180501: add one char to members permissions
ALTER TABLE `member` MODIFY COLUMN `cPermission` CHAR(12) NOT NULL;
UPDATE `member` SET `cPermission` = CONCAT(`cPermission`, "0");

-- 180501: Change type of member permission to text because of length
ALTER TABLE `member` MODIFY COLUMN `cPermission` TEXT NOT NULL;

-- 180501: Change type of member permission to text because of length
UPDATE `member` SET `cPermission` = CONCAT(`cPermission`, "0");

-- 180502: Change type of member permission to text because of length
UPDATE `member` SET `cPermission` = CONCAT(`cPermission`, "0");

-- 180502: Change type of member permission to text because of length
UPDATE `member` SET `cPermission` = CONCAT(`cPermission`, "0");

-- 180502: Change type of member permission to text because of length
UPDATE `member` SET `cPermission` = CONCAT(`cPermission`, "0");

-- 180502: Change type of member permission to text because of length
UPDATE `member` SET `cPermission` = CONCAT(`cPermission`, "0");

-- 180502: Change type of member permission to text because of length
UPDATE `member` SET `cPermission` = CONCAT(`cPermission`, "0");

-- 180502: Change type of member permission to text because of length
UPDATE `member` SET `cPermission` = CONCAT(`cPermission`, "0");

-- 180502: Change type of member permission to text because of length
UPDATE `member` SET `cPermission` = CONCAT(`cPermission`, "0");

-- 180502: Change type of member permission to text because of length
UPDATE `member` SET `cPermission` = CONCAT(`cPermission`, "0");

-- 180503: Change type of member permission to text because of length
UPDATE `member` SET `cPermission` = CONCAT(`cPermission`, "00");

-- 180503: Change type of member permission to text because of length
UPDATE `member` SET `cPermission` = CONCAT(`cPermission`, "0");

-- 180503: Change type of member permission to text because of length
UPDATE `member` SET `cPermission` = CONCAT(`cPermission`, "0");

-- 180504: Change type of member permission to text because of length
UPDATE `member` SET `cPermission` = CONCAT(`cPermission`, "0");

-- 180504: dtFinish in task can be null
ALTER TABLE `task` MODIFY COLUMN `dtFinish` BIGINT NULL;

-- 180505: Add more defined data in taskchanges
ALTER TABLE `taskchange` Change `sText` `sColumn` VARCHAR(255) NOT NULL;
ALTER TABLE `taskchange` ADD `sOldData` VARCHAR(255) NOT NULL;
ALTER TABLE `taskchange` ADD `sNewData` VARCHAR(255) NOT NULL;

-- 180505: Drop olddata column in taskchange
ALTER TABLE `taskchange` DROP COLUMN `sOldData`;

-- 180505:Add full task Change permissions
UPDATE `member` SET `cPermission` = CONCAT(`cPermission`, "0000000");

-- 180505: add changedate to taskchange
ALTER TABLE `taskchange` ADD `dtCreate` BIGINT NOT NULL;

-- 180506: Add char in permissions of member for Task.Delete
UPDATE `member` SET `cPermission` = CONCAT(`cPermission`, "0");

-- 180506: Add char in permissions of member
UPDATE `member` SET `cPermission` = CONCAT(`cPermission`, "0");

-- 180506: Add a deactivate group date
ALTER TABLE `group` ADD `dtDeactivate` BIGINT NULL;
