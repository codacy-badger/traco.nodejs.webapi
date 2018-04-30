
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
