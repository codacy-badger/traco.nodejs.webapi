
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

In the `./db` directory are script to create and import a MySQL Database. The Scriptnames are self-explanatory

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

 - [ ] Rework the `simple-file-logger.js` to easyer use and replace the old logger
 - [ ] Extend `nativ/date.js` with `.normalizeDate()`. A function wich will generate a `new Date()` with given input like unix, iso or something else date format.
 - [ ] Build a function in `dbhandler.js` that generate a INSERT-Statement with given DBClass and then extend THIS in the `insertOrUpdate()` instead of dobble the code.
 - [ ] `modul/logger.js` deltetion prozess as a cron-job. Done every day/hour/minute.


## Backlog

 - [ ] Create JSDoc Information for `helper.js`
 - [ ] Create JSDoc Information for `prohelper.js`


## Finished

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
