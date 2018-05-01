
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
