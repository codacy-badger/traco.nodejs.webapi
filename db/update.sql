
-- add one char to permissions
ALTER TABLE `member` MODIFY COLUMN `cPermission` CHAR(2) NOT NULL;
UPDATE `member` SET `cPermission` = CONCAT(`cPermission`, "1");
