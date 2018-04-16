@echo off
echo.
echo Syntax (defaults in MySQLVARS.bat are used for missing parameters):
echo DROPALLT[-u USERNAME] [-p PASSWORD] [-db DBNAME] [-s SERVER]
echo.
call MySQLVars.bat

:loop
IF NOT "%1"=="" (
    IF "%1"=="-u" (
        SET MySQL_USER=%2
        SHIFT
    )
    IF "%1"=="-p" (
        SET MySQL_PASSWD=%2
        SHIFT
    )
    IF "%1"=="-s" (
        SET MySQL_SERV=%2
        SHIFT
	)
    IF "%1"=="-db" (
        SET MySQL_DB=%2
        SHIFT
    )
    SHIFT
    GOTO :loop
)

SET /P ABFRAGE=Drop all tables in database %MySQL_DB% using user %MySQL_USER% on %MySQL_SERV% [Y]es / [N]o? 
IF "%ABFRAGE%"=="N" GOTO FEHLER
IF "%ABFRAGE%"=="n" GOTO FEHLER

:EXEC
echo START: 
time /T
REM Löschen der Datenbank mit User
echo dropping Database...
mysql -h %MySQL_SERV% -P %MySQL_PORT%  -u %MySQL_ADMIN% --password=%MySQL_ADMINPASSWD% -e "SET @usr = '"%MySQL_USER%"', @db = '"%MySQL_DB%"', @serv = '"%MySQL_SERV%"'; SOURCE dropdb.sql;"
REM Neuerstellung der Datenbank mit User
echo creating Database...
mysql -h %MySQL_SERV% -P %MySQL_PORT%  -u %MySQL_ADMIN% --password=%MySQL_ADMINPASSWD% -e "SET @usr = '"%MySQL_USER%"', @passwd = '"%MySQL_PASSWD%"', @serv = '"%MySQL_SERV%"'; SOURCE createdb.sql;"
echo ENDE: 
time /T
goto ENDE

:FEHLER
echo All tables NOT dropped.

:ENDE
