
# __TraCo -- NodeJS WebAPI__

[![dependencies Status](https://david-dm.org/DerHerrGammler/traco.nodejs.webapi/status.svg)](https://david-dm.org/DerHerrGammler/traco.nodejs.webapi)
[![devDependencies Status](https://david-dm.org/DerHerrGammler/traco.nodejs.webapi/dev-status.svg)](https://david-dm.org/DerHerrGammler/traco.nodejs.webapi?type=dev)
[![optionalDependencies Status](https://david-dm.org/DerHerrGammler/traco.nodejs.webapi/optional-status.svg)](https://david-dm.org/DerHerrGammler/traco.nodejs.webapi?type=optional)
<!-- [![peerDependencies Status](https://david-dm.org/DerHerrGammler/traco.nodejs.webapi/peer-status.svg)](https://david-dm.org/DerHerrGammler/traco.nodejs.webapi?type=peer) -->

[![GitHub package version](https://img.shields.io/github/package-json/v/DerHerrGammler/traco.nodejs.webapi.svg?logo=github&logoWidth=20)](https://github.com/DerHerrGammler/traco.nodejs.webapi/)
[![GitHub license](https://img.shields.io/github/license/DerHerrGammler/traco.nodejs.webapi.svg?logo=github&logoWidth=20)](https://github.com/DerHerrGammler/traco.nodejs.webapi/blob/master/LICENSE.md)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/912b36d136af4c7e85dac15fd12b5a84)](https://www.codacy.com/app/DerHerrGammler/traco.nodejs.webapi?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=DerHerrGammler/traco.nodejs.webapi&amp;utm_campaign=Badge_Grade)  
[![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/DerHerrGammler/traco.nodejs.webapi.svg)](https://github.com/DerHerrGammler/traco.nodejs.webapi/)
[![GitHub repo size in bytes](https://img.shields.io/github/repo-size/DerHerrGammler/traco.nodejs.webapi.svg)](https://github.com/DerHerrGammler/traco.nodejs.webapi/)

[![Logo](/.info/logo-TraCo.svg)](https://github.com/DerHerrGammler/traco.nodejs.webapi/)

## Setup

Run `npm install` to install the dependencies.

In the `./db` directory are script to create and import a MySQL Database. The Scriptnames are self-explanatory. You can manually create group and add a user in the database with passwordhash `$2a$10$dehcdLxBydqPl/TJ.nOD7OqG3IVMQnQEBW/tbg4GIgdDrTo5xVTfu` to set `master` as password.

Create a `config.json` in the `./static` folder wich has a structure like `config.default.json`.

## Development

Run `node server.js` to start the WebAPI-Server on [localhost:3000](http://localhost:3000) by default.

Run `npm run erplorer` to start a onlineExplorer on [localhost:8001](http://localhost:8001) by default.

Run `npm run apidoc` to compile the documentation of the API into the `./apidoc` directory.  
Run `npm run jsdoc` to compile the documentation of the modules into the `./jsdoc` directory.  
Run `npm run doc` to compile both documentations.


---

# __TO-DO-List__

## On Deck

 - [ ] Rebuild the `importdb.bat` with `mysqlimport` instead of `mysql` because it should be faster as just load the complete file as SQL-Statements.
 - [ ] Create secound version of the `JsonTable.join()` function with set all same at the same time and dont insert one row after the last ant search every time for the joining element.

## Backlog

 - [ ] ...

## Finished

 - [x] API for requesting groups with filter. Mximum return of 25 groups.
 - [x] register formular for contacts
 - [x] correction and finish of `/contact/notes` API-Command with apiDocs
 - [x] Creates the JSDoc for new DBClasses
 - [x] Create new DBClass-Files for all DB-Tables
 - [x] Rebuild of the `leer.tar.xz` Database file
 - [x] `module/logger.js` need a function to automaticly create the logging folder if it doesen't exists.
 - [x] Add `delete()` to the `jsonSQL.js`
 - [x] Recreate the `jsonSQL.js` modul.
 - [x] Extend the errorhandling in `dbhandler.js`. Must be include some type for httpErrorHandler that the client has information Code 500 internal server error.
 - [x] Extend `exNativ/date.js` with `.normalizeDate()`. A function wich will generate a `new Date()` with given input like unix, iso or something else date format.
 - [x] Create JSDoc Information for `prohelper.js`
 - [x] Add a boolean to the options of the Logger to disable the delete process.
 - [x] Create JSDoc Information for `helper.js`
 - [x] `modul/logger.js` deltetion prozess as a cron-job. Done every day/hour/minute.
 - [x] Build a function in `dbhandler.js` that generate a INSERT-Statement with given DBClass and then extend THIS in the `insertOrUpdate()` instead of dobble the code.
 - [x] Rework the `simple-file-logger.js` to easyer use and replace the old logger
 - [x] Include the new module instead of using the prototypes
 - [x] Implement in the new `module/logger.js` a function for automatik file deletion if the file is older than the max Date
 - [x] `module/logger.js` have to log hourly a file if the iSaveDays timer is smaller than a day and have to log minute files if the iSaveDays is smaller than one hour. And if the iSaveDays is smaller than a minute it will automaticly scaled up to 5 minutes.
 - [x] New `module/logger.js` need a enum with logfile default loglevel values like `DEBUG`, `INFO`, `WARN`, `ERROR`.
 - [x] Extend all `db-Scripts` with the `-v Vars-file` Option and a better view in the cmd.
 - [x] Extend the `importdb.bat` and `exportdb.bat` with an option like `-v filename` to import a database configuration from a file. This is important, because then i can save multiple configuration und doesn't have change the main `MySQLVars.bat`. I can configure one `Vars.bat` per maintained Server/Database.
 - [x] New `dbhandler.fetch()` function with safe @0, @1... insert into dbcurser 
 - [x] Create JSDoc Information for `dbhandler.js`
 - [x] Prototype `array.js` rebuild to modul
 - [x] Extend the `exportdb.bat` and the `importdb.bat` to export and import tables into seperate files per table.
 - [x] Prototype `date.js` rebuild to modul
 - [x] Prototype `object.js` rebuild to modul
