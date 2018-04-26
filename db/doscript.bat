@echo off
REM Syntax:
echo.
echo Syntax (defaults in MySQLVARS.bat are used for missing parameters):
echo DOSCRIPT -f filename [-u USERNAME] [-p PASSWORD] [-db DBNAME] [-s SERVER] [-v Vars-File]
echo.
if "%1" == "" echo SQL-script (parameter -f) not defined.
if "%1" == "" goto ENDE

SET importf=
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
    IF "%1"=="-f" (
        SET importf=%2
        SHIFT
    )
    IF "%1"=="-v" (
        call %2
        SHIFT
    )
    SHIFT
    GOTO :loop
)

if "%importf%"=="" echo SQL-script (parameter -f) not defined.
if "%importf%"=="" goto ENDE

if NOT EXIST %importf% (
echo SQL-script %importf% not found.
GOTO ENDE
)
echo Sql-script: %importf%
SET /P ABFRAGE=Execute using database %MySQL_DB% and user %MySQL_USER% on %MySQL_SERV%:%MySQL_PORT% [Y]es / [N]o?
IF "%ABFRAGE%"=="N" GOTO FEHLER
IF "%ABFRAGE%"=="n" GOTO FEHLER

:EXEC
echo. && echo. && echo.
echo --- START: %time:~0,2%:%time:~3,2%:%time:~6,2% ---
echo.
REM Importierung einer *.sql Datei in die Datenbank
echo importing Script...
mysql --show-warnings -h %MySQL_SERV% -P %MySQL_PORT% -u %MySQL_USER% --password=%MySQL_PASSWD% -D %MySQL_DB% < %importf%
echo.
echo --- ENDE:  %time:~0,2%:%time:~3,2%:%time:~6,2% ---
echo. && echo.
goto ENDE

:FEHLER
echo SQL-script %importf% NOT executed.

:ENDE
