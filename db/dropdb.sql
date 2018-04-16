--**************************************************************************
-- FILE : DROPDB.SQL
-- Datenbank und Anmeldung werden gelöscht.
--**************************************************************************

SET @query = CONCAT("DROP DATABASE `", @db, "`;");
PREPARE stmt FROM @query; EXECUTE stmt; DEALLOCATE PREPARE stmt;
SET @query = CONCAT("DROP USER IF EXISTS '", @usr, "'@'", @serv, "';");
PREPARE stmt FROM @query; EXECUTE stmt; DEALLOCATE PREPARE stmt;
