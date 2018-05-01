----------------------------------------
-- SQL-Statements for CREATE-only
----------------------------------------

-- TABLE: group
DROP TABLE IF EXISTS `group`;
CREATE TABLE `group` (
    `groupID` CHAR(4) NOT NULL,         -- 14.776.336 mögliche Gruppen
    `sName` VARCHAR(191) NOT NULL,
    `dtSince` BIGINT NOT NULL,
    `iTasks` BIGINT NOT NULL,           -- Hier wird der Zähler für die Tickets gecountet, damit dieser schneller erreichbar ist
    PRIMARY KEY(`groupID`),
    UNIQUE KEY (`sName`)
);

-- TABLE: member
DROP TABLE IF EXISTS `member`;
CREATE TABLE `member` (
    `memberID` CHAR(8) NOT NULL,        -- durschnittlich max. 14.776.336 Member pro Gruppe
    `idContact` CHAR(9) NOT NULL,
    `idGroup` CHAR(4) NOT NULL,
    `sUsername` VARCHAR(191) NOT NULL,
    `sPassword` TEXT NOT NULL,
    `cPermission` TEXT NOT NULL,
    `dtSince` BIGINT NOT NULL,
    `dtAccess` BIGINT NULL,
    `sEmail` VARCHAR(191) NOT NULL,
    `sFirstname` VARCHAR(255) NOT NULL,
    `sLastname` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`memberID`),
    UNIQUE KEY (`idGroup`, `sUsername`),
    UNIQUE KEY (`idGroup`, `sEmail`)
);

-- TABLE: contact
DROP TABLE IF EXISTS `contact`;
CREATE TABLE `contact` (
    `contactID` CHAR(9) NOT NULL,       -- durschnittlich max. 916.132.832 Kontakte pro Gruppe
    `idGroup` CHAR(4) NOT NULL,
    `sUsername` VARCHAR(191) NOT NULL,
    `sPassword` TEXT NOT NULL,
    `dtSince` BIGINT NOT NULL,
    `dtAccess` BIGINT NULL,
    `sEmail` VARCHAR(191) NOT NULL,
    `sFirstname` VARCHAR(255) NOT NULL,
    `sLastname` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`contactID`),
    UNIQUE KEY (`idGroup`, `sUsername`),
    UNIQUE KEY (`idGroup`, `sEmail`)
);

-- TABLE: projekt
DROP TABLE IF EXISTS `project`;
CREATE TABLE `project` (
    `projectID` CHAR(7) NOT NULL,       -- durschnittlich max. 238.328 Projekte pro Gruppe
    `idGroup` CHAR(4) NOT NULL,
    `sName` VARCHAR(191) NOT NULL,
    `dtSince` BIGINT NOT NULL,          -- Entweder Erstellungsdatum des Projektes im System oder alternative Zeitangabe
    `sText` TEXT NOT NULL,              -- Informationen zum Projekt
    `bInten` BOOLEAN NOT NULL,          -- store 0/1 for false/true  Ob das Projekt NUR intern oder auch für Kontakte sichtbar ist
    PRIMARY KEY (`projectID`),
    UNIQUE KEY (`idGroup`, `sName`)
);

-- TABLE: taskstatus
DROP TABLE IF EXISTS `taskstatus`;
CREATE TABLE `taskstatus` (
    `taskstatusID` CHAR(7) NOT NULL,   -- durschnittlich max. 3.844 Taskstatus pro Gruppe
    `idGroup` CHAR(4) NOT NULL,
    `sName` VARCHAR(191) NOT NULL,
    `iOrder` INT NOT NULL,              -- Reihfolge der verschiedenen Status festhalten, damit diese in der Richtigen Reihnfolge geladen werden können.
    PRIMARY KEY (`taskstatusID`),
    UNIQUE KEY (`idGroup`, `sName`)
);

-- TABLE: tasktype
DROP TABLE IF EXISTS `tasktype`;
CREATE TABLE `tasktype` (
    `tasktypeID` CHAR(7) NOT NULL,      -- durschnittlich max. 3.844 Tasktyen pro Gruppe
    `idGroup` CHAR(4) NOT NULL,
    `sName` VARCHAR(191) NOT NULL,
    `bIntern` BOOLEAN NOT NULL,          -- store 0/1 for false/true  Ob der Typ NUR intern oder auch für Kontakte sichtbar ist
    PRIMARY KEY (`tasktypeID`),
    UNIQUE KEY (`idGroup`, `sName`)
);

-- TABLE: task
DROP TABLE IF EXISTS `task`;
CREATE TABLE `task` (
    `taskID` CHAR(16) NOT NULL,         -- durschnittlich max. 3.226.270.000.000.000.000.000 Ticket pro Gruppe
    `idGroup` CHAR(4) NOT NULL,
    `iTask` BIGINT NOT NULL,            -- Der zähler für die tickets, damit sich diese einfacher identifizieren lassen und eine einfache ID für einen Benutzer haben
    `iPrio` TINYINT NOT NULL,           -- Zwar maximal 127 möglich aber vorgesehen ist 1 - 9
    `idProject` CHAR(7) NOT NULL,
    `idTaskstatus` CHAR(7) NOT NULL,
    `idTasktype` CHAR(7) NOT NULL,
    `idContact` CHAR(9) NOT NULL,
    `idMember` CHAR(8) NOT NULL,
    `dtCreate` BIGINT NOT NULL,         -- Erstellungsdatum des Tickets
    `dtFinish` BIGINT NOT NULL,         -- Erledigt bis Datum NICHT WANN ES FERTIG IST
    `sTitle` VARCHAR(255) NOT NULL,
    `sText` TEXT NOT NULL,
    `dtClose` BIGINT NULL,              -- Wenn dieses Feld gesetzt wird ist das Ticket geschlossen.
    PRIMARY KEY (`taskID`),
    UNIQUE KEY (`idGroup`, `iTask`)
);

-- TABLE: taskchange
DROP TABLE IF EXISTS `taskchange`;
CREATE TABLE `taskchange` (
    `taskchangeID` CHAR(20) NOT NULL,   -- durschnittlich max. 14.776.336 Änderungen pro Task
    `idTask` CHAR(16) NOT NULL,
    `idMember` CHAR(8) NOT NULL,
    `sText` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`taskchangeID`)
);

-- TABLE: note
DROP TABLE IF EXISTS `membernote`;
CREATE TABLE `membernote` (
    `membernoteID` CHAR(15) NOT NULL,         -- durschnittlich max. ca. 3.521.600.000.000 Notizen pro Member
    `idMember` CHAR(8) NOT NULL,
    `dtCreate` BIGINT NOT NULL,
    `sText` TEXT NOT NULL,
    PRIMARY KEY (`membernoteID`)
);
