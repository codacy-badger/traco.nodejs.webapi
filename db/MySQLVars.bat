@echo off
REM Tip: Leave user and password variables empty to use Windows-Authentication

REM MySQL_USER = User
REM MySQL_PASSWD = User password
REM MySQL_ADMIN= Admin user (normally root)!
REM MySQL_ADMINPASSWD= Password für admin user

REM MySQL_DB = DB-Name
REM MySQL_SERV = Server-IP od Server-Name (including instance name if required)
REM set MySQL_PORT = Port of the Server
REM MySQL_VERZ = Local folder on server for database file storoage
 
set MySQL_USER=traco
set MySQL_PASSWD=traco
set MySQL_ADMIN=root
set MySQL_ADMINPASSWD=

set MySQL_DB=%MySQL_USER%
set MySQL_SERV=localhost
set MySQL_PORT=3306
