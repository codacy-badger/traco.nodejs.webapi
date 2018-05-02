
-- 180502: Change type of member permission to text because of length
UPDATE `member` SET `cPermission` = CONCAT(`cPermission`, "0");
