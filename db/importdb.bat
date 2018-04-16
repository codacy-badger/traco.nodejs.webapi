@echo off
REM Syntax:
echo.
echo Syntax (defaults in MySQLVARS.bat are used for missing parameters):
echo IMPORT -f filename [-u USERNAME] [-p PASSWORD] [-db DBNAME] [-s SERVER]
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
    SHIFT
    GOTO :loop
)

if "%importf%"=="" echo Import file (parameter -f) not defined. 
if "%importf%"=="" goto ENDE
REM If second letter not :, then the parameter doen not contain an absolute path
REM In this case use the Pseudo-Variable %CD% to add the current directory.
IF NOT "%importf:~1,1%" == ":" SET importf=%CD%\%importf%

echo Import file: %importf%
SET /P ABFRAGE=Import database %MySQL_DB% on %MySQL_SERV% [Y]es / [N]o? 
IF "%ABFRAGE%"=="N" GOTO FEHLER
IF "%ABFRAGE%"=="n" GOTO FEHLER

:EXPORT
echo START: 
time /T
echo importing Database...
xzdec %importf% | mysql -h %MySQL_SERV% -P %MySQL_PORT% -u %MySQL_USER% --password=%MySQL_PASSWD% -D %MySQL_DB%
echo ENDE: 
time /T
goto ENDE

:FEHLER
echo Database %MySQL_DB% on %MySQL_SERV% NOT imported.

:ENDE
