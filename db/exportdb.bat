@echo off
REM Syntax:
echo.
echo Syntax (defaults in MySQLVARS.bat are used for missing parameters):
echo EXPORT -f filename [-u USERNAME] [-p PASSWORD] [-db DBNAME] [-s SERVER]
echo.
if "%1" == "" echo SQL-script (parameter -f) not defined. 
if "%1" == "" goto ENDE

SET exportf=
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
        SET exportf=%2
        SHIFT
    )
    SHIFT
    GOTO :loop
)

if "%exportf%"=="" echo Export file (parameter -f) not defined. 
if "%exportf%"=="" goto ENDE
REM If second letter not :, then the parameter doen not contain an absolute path
REM In this case use the Pseudo-Variable %CD% to add the current directory.
REM IF NOT "%exportf:~1,1%" == ":" SET exportf=%CD%\%exportf%.sql.xz
IF NOT "%exportf:~1,1%" == ":" SET exportf=%CD%\%exportf%.sql.xz

if EXIST %exportf% (
del /P %exportf%
echo.
)
echo Export file: %exportf%
SET /P ABFRAGE=Export database %MySQL_DB% as user %MySQL_USER% on %MySQL_SERV% [Y]es / [N]o? 
IF "%ABFRAGE%"=="N" GOTO FEHLER
IF "%ABFRAGE%"=="n" GOTO FEHLER

:EXPORT
echo START: 
time /T
echo exporting Database...
mysqldump -v -i -c --dump-date -n -h %MySQL_SERV% -P %MySQL_PORT% -u %MySQL_USER% --password=%MySQL_PASSWD% %MySQL_DB% | xz > %exportf%
echo ENDE: 
time /T
goto ENDE

:FEHLER
echo Database %MySQL_DB% as user %MySQL_USER% NOT exported.

:ENDE
