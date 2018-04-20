@echo off
REM Syntax:
echo.
echo Syntax (defaults in MySQLVARS.bat are used for missing parameters):
echo DROPDB [-u USERNAME] [-p PASSWORD] [-db DBNAME] [-s SERVER] [-v Vars-File]
echo.
call MySQLVars.bat
SET MySQL_PASSWD=%MySQL_ADMINPASSWD%

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
    IF "%1"=="-v" (
        call %2
        SHIFT
    )
    SHIFT
    GOTO :loop
)

SET /P ABFRAGE=Drop database %MySQL_DB% and user %MySQL_USER% on %MySQL_SERV%:%MySQL_PORT% [Y]es / [N]o?
IF "%ABFRAGE%"=="N" GOTO FEHLER
IF "%ABFRAGE%"=="n" GOTO FEHLER

:DROP
echo. && echo. && echo.
echo --- START: %time:~0,2%:%time:~3,2%:%time:~6,2% ---
echo.
REM Löschung der Datenbenk mit User
echo dropping Database...
mysql -h %MySQL_SERV% -P %MySQL_PORT%  -u %MySQL_ADMIN% --password=%MySQL_ADMINPASSWD% -e "SET @usr = '"%MySQL_USER%"', @db = '"%MySQL_DB%"', @serv = '"%MySQL_SERV%"'; SOURCE dropdb.sql;"
echo.
echo --- ENDE:  %time:~0,2%:%time:~3,2%:%time:~6,2% ---
echo. && echo.
goto ENDE

:FEHLER
echo Database %MySQL_DB% and user %MySQL_USER% NOT dropped.

:ENDE
