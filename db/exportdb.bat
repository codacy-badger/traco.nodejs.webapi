@echo off
REM Syntax:
echo.
echo Syntax (defaults in MySQLVARS.bat are used for missing parameters):
echo EXPORT -f filename [-u USERNAME] [-p PASSWORD] [-db DBNAME] [-s SERVER] [-v Vars-File]
echo.
IF "%1" == "" echo SQL-script (parameter -f) not defined.
IF "%1" == "" goto ENDE

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
    IF "%1"=="-v" (
        call %2
        SHIFT
    )
    SHIFT
    GOTO :loop
)

IF "%exportf%"=="" echo Export file (parameter -f) not defined.
IF "%exportf%"=="" goto ENDE
REM IF second letter not :, then the parameter doen not contain an absolute path
REM In this case use the Pseudo-Variable %CD% to add the current directory.
IF NOT "%exportf:~1,1%" == ":" SET exportf=%CD%\%exportf%

IF EXIST %exportf%.tar.xz (
    del /P %exportf%.tar.xz
    echo.
)
echo Export file: %exportf%
SET /P ABFRAGE=Export database %MySQL_DB% as user %MySQL_USER% on %MySQL_SERV%:%MySQL_PORT% [Y]es / [N]o?
IF "%ABFRAGE%"=="N" ( GOTO FEHLER )
IF "%ABFRAGE%"=="n" ( GOTO FEHLER )

:EXPORT
echo. && echo. && echo.
echo --- START: %time:~0,2%:%time:~3,2%:%time:~6,2% ---

echo.
echo start EXPORT pre-processing...
IF EXIST %exportf% rmdir /s /q %exportf%
IF EXIST %exportf%.tables.txt del /q %exportf%.tables.txt
IF EXIST %exportf%.tar del /q %exportf%.tar
mkdir %exportf%
mysql -s -h %MySQL_SERV% -P %MySQL_PORT% -u %MySQL_USER% --password=%MySQL_PASSWD% -D %MySQL_DB% -e "show tables;"  > %exportf%.tables.txt

echo.
echo start EXPORT Database...
SET tbl_count=0
for /F %%T in (%exportf%.tables.txt) do (
    echo  -- EXPORT TABLE: %%T
    mysqldump -i -c -C --dump-date -n -h %MySQL_SERV% -P %MySQL_PORT% -u %MySQL_USER% --password=%MySQL_PASSWD% %MySQL_DB% %%T > %exportf%\%%T.sql
    SET /a tbl_count += 1
)
echo %tbl_count% table[s] dumped from database '%MySQL_DB%'

echo.
echo start EXPORT post-processing...
REM More Information about 7za in the 7-zip Installation directory `7-zip.chm`
7za a %exportf%.tar "%exportf%\*.sql" | FIND "size"
7za a %exportf%.tar.xz "%exportf%.tar" | FIND "size"
rmdir /s /q %exportf%
del /q %exportf%.tables.txt
del /q %exportf%.tar

echo.
echo --- ENDE:  %time:~0,2%:%time:~3,2%:%time:~6,2% ---
echo. && echo.
goto ENDE

:FEHLER
echo Database %MySQL_DB% as user %MySQL_USER% NOT exported.

:ENDE
