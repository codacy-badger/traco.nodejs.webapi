--**************************************************************************
-- FILE : createdb.sql
-- Datenbank und Anmeldung werden erstellt.
--**************************************************************************

SET @query = CONCAT("CREATE USER IF NOT EXISTS '", @usr, "'@'", @serv, "';");
PREPARE stmt FROM @query; EXECUTE stmt; DEALLOCATE PREPARE stmt;
SET @query = CONCAT("SET PASSWORD FOR '", @usr, "'@'", @serv, "' = PASSWORD('", @passwd, "');");
PREPARE stmt FROM @query; EXECUTE stmt; DEALLOCATE PREPARE stmt;
SET @query = CONCAT("GRANT ALL PRIVILEGES ON `", @usr, "`.* TO '", @usr, "'@'", @serv, "';");
PREPARE stmt FROM @query; EXECUTE stmt; DEALLOCATE PREPARE stmt;
FLUSH PRIVILEGES;
SET @query = CONCAT("CREATE DATABASE IF NOT EXISTS `", @usr, "` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;");
PREPARE stmt FROM @query; EXECUTE stmt; DEALLOCATE PREPARE stmt;
