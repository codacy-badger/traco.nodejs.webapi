"use strict";
/** @module */
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Dependencies
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
require("../prototype/loadPrototype");

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Function
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * Das ist der Construktor der JsonDB-Klasse.
 * @method _JsonDB
 * @param {Object|Object[]|string[]} [iniData] Ein Datensatz, viele Datensätze oder ein Array aus String für Collumn Namen.
 * @returns {void}
 */
var JsonDB = function (iniData) {
    this.cols = [];
    this.data = [];
    this.where = null;

    if (iniData instanceof Array) {
        if (iniData[0] instanceof Object) {
            this.insertMulti(iniData);
        } else if (typeof iniData[0] === "string") {
            this.setCols(iniData);
        } else {
            throw new TypeError("Wrong Datatype given");
        }
    } else if (iniData instanceof Object) {
        this.insert(iniData);
    }
};


/**
 * Eine neuer Datensatz wird zu der Tabelle hinzugefügt.
 * @method insert
 * @param {Object} oData Datensatz zum hinzufügen
 * @returns {void}
 */
JsonDB.prototype.insert = function (oData) {
    if (!oData) {
        throw new TypeError("No Data given");
    }
    if (!(oData instanceof Object)) {
        throw new TypeError("Wrong Datatype");
    }

    var aCols = Object.keys(oData);
    if (this.cols.length === 0) {
        this.setCols(aCols);
    } else if (!this.cols.compare(aCols)) {
        throw new TypeError("Your Dataset is not the expected");
    }
    this.data.push(oData);
    return this;
};

/**
 * @method insertMulti
 * @param {Object[]} aData Ein Array aus Datensätzen, die Conform sind
 * @returns {void}
 */
JsonDB.prototype.insertMulti = function (aData) {
    if (!aData) {
        throw new TypeError("No Data given");
    }
    if (!(aData instanceof Array)) {
        throw new TypeError("Given Data isn't an Array");
    }

    var i = 0;
    while (i < aData.length) {
        this.insert(aData[i]);
        i += 1;
    }
    return this;
};


/**
 * @method getData
 * @returns {Object[]}
 * Alle Daten, die eingetragen sind, werden zurückgegeben.
 */
JsonDB.prototype.getData = function () {
    return this.data;
};


/**
 * Die Datenbankstruktur wird neu angelegt. Dafür dürfen keine Daten vorhanden sein.
 * @method setCols
 * @param {string[]} aCols Array as Collums, welche gesetzt werden sollen.
 * @returns {void}
 */
JsonDB.prototype.setCols = function (aCols) {
    if (this.cols.length !== 0) {
        console.warn("Overwrite old collumns! Collumns where already set"); // eslint-disable-line
    }
    if (!aCols) {
        throw new TypeError("No Collumns given");
    }
    if (this.data.length !== 0) {
        throw new TypeError("Data is always set! Can't change the collumns now");
    }
    this.cols = aCols;
    return this;
};

/**
 * Eine neue Collumn wird mit dem default-Wert oder null-Wert angelegt.
 * @method addCol
 * @param {string} newCol Namen der neuen Collumn zum hinzufügen.
 * @param {string} dData Datenwert der zu den vorhanden Rows als default eingefügt wird.
 * @returns {void}
 */
JsonDB.prototype.addCol = function (newCol, [dData]) {
    if (!newCol) {
        throw new TypeError("No Collumn given");
    }
    this.cols.push(newCol);
    if (!dData) {
        dData = null;
    }

    if (this.data.length !== 0) {
        var i = 0;
        while (i < this.data.length) {
            this.data[i][newCol] = dData;
            i += 1;
        }
    }
    return this;
};

/**
 * @method dropCol
 * @param {string} sCol Collumne welche gedropped werden soll
 * @param {void}
 */
JsonDB.prototype.dropCol = function (sCol) {
    if (!sCol) {
        throw new TypeError("No Collumn for dropping given");
    }
    if (!this.cols.includes(sCol)) {
        throw new TypeError("Collumn doesn't exists");
    }

    this.cols.removeStr(sCol);

    var i = 0;
    while (i < this.data.length) {
        delete this.data[i][sCol];
        i += 1;
    }
    return this;
};


/**
 * @method getRow
 * @returns {Object}
 * Ein neues Object, welches der Strucktur der Datenbank entspricht.
 */
JsonDB.prototype.getRow = function () {
    var oRow = {};
    var i = 0;
    while (i < this.cols.length) {
        oRow[this.cols[i]] = null;
        i += 1;
    }
    return oRow;
};

/**
 * Die Daten aus der Datenbank werden vollständig gelöscht.
 * @method clearDB
 * @returns {void}
 */
JsonDB.prototype.clearDB = function () {
    this.data = [];
    return this;
};

/**
 * @method unique
 * @param {string} sCol
 * @returns {any[]}
 * Die daten der ausgewählten spalte werden als Unique Array zurückgegeben.
 */
JsonDB.prototype.unique = function (sCol) {
    if (!sCol) {
        throw new TypeError("No Collumn given");
    }
    if (!this.cols.includes(sCol)) {
        throw new TypeError("Collumn doesn't exists");
    }

    var i = 0;
    while (i < this.data.length) {
        arr.push(this.data[i][sCol]);
        i += 1;
    }
    return arr.unique();
};


/**
 * Die Daten in this.data werden mit den angegebenen Collumns sortiert.
 * @method orderBy
 * @param {string[]} aCols Collumns die sortiert werden sollen der Reihnfolge nach
 * @param {string[]} [aDest] ASC oder DESC für jedes Element. Wenn es nicht DESC ist wird ASC soritert
 * @returns {void}
 */
JsonDB.prototype.orderBy = function (aCols, aDest) {
    if (arguments.length === 0) {
        throw new TypeError("orderBy() MUST have at least 1 argument");
    }
    if (this.data.length === 0) {
        console.warn("No data set"); // eslint-disable-line
        return this;
    }

    if (!aDest) {
        aDest = [];
    }
    var aArgs = [];
    var i = 0;
    while (i < aCols.length) {
        if (!this.cols.includes(aCols[i])) {
            throw new TypeError("Collumn '" + aCols[i] + "' doesn't exists");
        }
        if (!aDest[i]) {
            aDest[i] = "";
        }
        if (aDest[i] === "DESC") {
            aArgs.push("-" + aCols[i]);
        } else {
            aArgs.push(aCols[i]);
        }
        i += 1;
    }
    this.data = this.data.sortBy(aArgs);
    return this;
};

/**
 * Die Daten die eingefügt wurden, werden dabei verändert und zu einem neuen JsonDB-Objekt.
 * @method select
 * @param {Object} oOpt Alle Optionen zum select Query auf die Daten.
 * @param {string} oOpt.col auf welche spalte bezogen
 * @param {string} oOpt.op Operation die Ausgeführt werden soll
 * @param {string} oOpt.param mit welchem parameter
 * @returns {JsonDB}
 * Ein neues JsonDB Objekt mit dem weitergearbeitet werden kann wird zurückgegeben
 */
JsonDB.prototype.select = function (oOpt) {
    if (!oOpt) {
        throw new TypeError("No Options for operation set");
    }

    var that = this;
    var _fFunc;
    switch (oOpt.op) {
        case (">="):
            _fFunc = function (row) {
                if (row[oOpt.col] >= oOpt.param) {
                    return true;
                }
                return false;
            };
            break;
        case ("<="):
            _fFunc = function (row) {
                if (row[oOpt.col] <= oOpt.param) {
                    return true;
                }
                return false;
            };
            break;
        case (">"):
            _fFunc = function (row) {
                if (row[oOpt.col] > oOpt.param) {
                    return true;
                }
                return false;
            };
            break;
        case ("<"):
            _fFunc = function (row) {
                if (row[oOpt.col] < oOpt.param) {
                    return true;
                }
                return false;
            };
            break;
        case ("!=="):
            _fFunc = function (row) {
                if (row[oOpt.col] !== oOpt.param) {
                    return true;
                }
                return false;
            };
            break;
        case ("==="):
            _fFunc = function (row) {
                if (row[oOpt.col] === oOpt.param) {
                    return true;
                }
                return false;
            };
            break;
        default:
            throw new TypeError("Operation doesn't exists");
    }
    that.data = that.data.filter(_fFunc);
    return that;
};

/**
 * Die eingefügten Daten werden auf den Operator überprüft und zu einem where Index hinzugefügt.
 * @method find
 * @param {Object} oOpt Alle Optionen zum select Query auf die Daten.
 * @param {string} oOpt.col auf welche spalte bezogen
 * @param {string} oOpt.op Operation die Ausgeführt werden soll
 * @param {string} oOpt.param mit welchem parameter
 * @returns {void}
 */
JsonDB.prototype.find = function (oOpt) {
    if (!oOpt) {
        throw new TypeError("No Options for operation set");
    }

    var _fFunc;
    switch (oOpt.op) {
        case (">="):
            _fFunc = function (row) {
                if (row[oOpt.col] >= oOpt.param) {
                    return true;
                }
                return false;
            };
            break;
        case ("<="):
            _fFunc = function (row) {
                if (row[oOpt.col] <= oOpt.param) {
                    return true;
                }
                return false;
            };
            break;
        case (">"):
            _fFunc = function (row) {
                if (row[oOpt.col] > oOpt.param) {
                    return true;
                }
                return false;
            };
            break;
        case ("<"):
            _fFunc = function (row) {
                if (row[oOpt.col] < oOpt.param) {
                    return true;
                }
                return false;
            };
            break;
        case ("!=="):
            _fFunc = function (row) {
                if (row[oOpt.col] !== oOpt.param) {
                    return true;
                }
                return false;
            };
            break;
        case ("==="):
            _fFunc = function (row) {
                if (row[oOpt.col] === oOpt.param) {
                    return true;
                }
                return false;
            };
            break;
        default:
            throw new TypeError("Operation doesn't exists");
    }

    this.where = [];
    var i = 0;
    while (i < this.data.length) {
        if (_fFunc(this.data[i])) {
            this.where.push(i);
        }
        i += 1;
    }
    return this;
};


module.exports.JsonDB = JsonDB;
