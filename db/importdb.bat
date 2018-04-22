@echo off
REM Syntax:
echo.
echo Syntax (defaults in MySQLVARS.bat are used for missing parameters):
echo IMPORT -f filename [-u USERNAME] [-p PASSWORD] [-db DBNAME] [-s SERVER] [-v Vars-File]
echo.
IF "%1" == "" echo SQL-script (parameter -f) not defined.
IF "%1" == "" goto ENDE

SET tmpfolder=%CD%\import
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

IF "%importf%"=="" echo Import file (parameter -f) not defined.
IF "%importf%"=="" goto ENDE
REM IF second letter not :, then the parameter doen not contain an absolute path
REM In this case use the Pseudo-Variable %CD% to add the current directory.
IF NOT "%importf:~1,1%" == ":" SET importf=%CD%\%importf%

echo Import file: %importf%
SET /P ABFRAGE=Import database %MySQL_DB% on %MySQL_SERV%:%MySQL_PORT% [Y]es / [N]o?
IF "%ABFRAGE%"=="N" GOTO FEHLER
IF "%ABFRAGE%"=="n" GOTO FEHLER

:EXPORT
echo. && echo. && echo.
echo --- START: %time:~0,2%:%time:~3,2%:%time:~6,2% ---

echo.
echo start IMPORT pre-processing...
IF EXIST %tmpfolder%.tar rmdir /s /q %tmpfolder%.tar
IF EXIST %tmpfolder%.sql rmdir /s /q %tmpfolder%.sql
REM More Information about 7za in the 7-zip Installation directory `7-zip.chm`
7za e %importf% -o%tmpfolder%.tar -aoa | FIND "Files"
7za e "%tmpfolder%.tar/*.tar" -o%tmpfolder%.sql -aoa | FIND "Files"

echo.
echo start IMPORT Database...
SET tbl_count=0
FOR /F "tokens=*" %%F IN ('dir /A /B %tmpfolder%.sql') DO (
    echo  -- IMPORT TABLE-File: %%F
    mysql -h %MySQL_SERV% -P %MySQL_PORT% -u %MySQL_USER% --password=%MySQL_PASSWD% -D %MySQL_DB% < %tmpfolder%.sql\%%F
    SET /a tbl_count += 1
)
echo %tbl_count% table[s] restored into database '%MySQL_DB%'

echo.
echo start IMPORT post-processing...
rmdir /s /q %tmpfolder%.tar
rmdir /s /q %tmpfolder%.sql

echo.
echo --- ENDE:  %time:~0,2%:%time:~3,2%:%time:~6,2% ---
echo. && echo.
goto ENDE

:FEHLER
echo Database %MySQL_DB% on %MySQL_SERV% NOT imported.

:ENDE
