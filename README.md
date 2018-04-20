
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

In the `./static` folder copy the `config.default.json` or `config.dev.json` into a `config.json`.

## Development

Run `node server.js` to start the WebAPI-Server on [localhost:3000](http://localhost:3000) by default.

Run `npm run erplorer` to start a onlineExplorer on [localhost:8001](http://localhost:8001) by default.

Run `npm run apidoc` to compile the documentation of the API into the `./apidoc` directory.  
Run `npm run jsdoc` to compile the documentation of the modules into the `./jsdoc` directory.  
Run `npm run docbuild` to compile both documentations.

<!-- ## Build

**-- NOT READY YET --** -->

---

# __TO-DO-List__

## On Deck

 - [ ] Include the new module instead of using the prototypes
 - [ ] Rework the `simple-file-logger.js` to easyer use and replace the old logger
 - [ ] Extend `nativ/date.js` with `.normalizeDate()`. A function wich will generate a `new Date()` with given input like unix, iso or something else date format.
- [ ]  Build a function in `dbhandler.js` that generate a INSERT-Statement with given DBClass and then extend THIS in the `insertOrUpdate()` instead of dobble the code.
- [ ]  Implement in the new `module/logger.js` a function for automatik file deletion if the file is older than the max Date


## Backlog

 - [ ] Create JSDoc Information for `helper.js`
 - [ ] Create JSDoc Information for `prohelper.js`


## Finished

 - [x] New `dbhandler.fetch()` function with safe @0, @1... insert into dbcurser 
 - [x] Create JSDoc Information for `dbhandler.js`
 - [x] Prototype `array.js` rebuild to modul
 - [x] Extend the `exportdb.bat` and the `importdb.bat` to export and import tables into seperate files per table.
 - [x] Prototype `date.js` rebuild to modul
 - [x] Prototype `object.js` rebuild to modul
