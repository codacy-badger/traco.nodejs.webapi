"use strict";
/** @module */
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Dependencies
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
require("../prototype/loadPrototype");
var exNativ = require("./exNativ");

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Exports
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
    } else if (!exNativ.Array.compare(aCols)) {
        throw new TypeError("Your Dataset is not the expected");
    }
    this.data.push(oData);
    return this;
};

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

JsonDB.prototype.getData = function () {
    return this.data;
};

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

JsonDB.prototype.dropCol = function (sCol) {
    if (!sCol) {
        throw new TypeError("No Collumn for dropping given");
    }
    if (!this.cols.includes(sCol)) {
        throw new TypeError("Collumn doesn't exists");
    }

    this.cols = exNativ.Array.removeStr(this.cols, sCol);

    var i = 0;
    while (i < this.data.length) {
        delete this.data[i][sCol];
        i += 1;
    }
    return this;
};

JsonDB.prototype.getRow = function () {
    var oRow = {};
    var i = 0;
    while (i < this.cols.length) {
        oRow[this.cols[i]] = null;
        i += 1;
    }
    return oRow;
};

JsonDB.prototype.clearDB = function () {
    this.data = [];
    return this;
};

JsonDB.prototype.unique = function (sCol) {
    if (!sCol) {
        throw new TypeError("No Collumn given");
    }
    if (!this.cols.includes(sCol)) {
        throw new TypeError("Collumn doesn't exists");
    }
    var arr;
    var i = 0;
    while (i < this.data.length) {
        arr.push(this.data[i][sCol]);
        i += 1;
    }
    return exNativ.Array.unique(arr);
};

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
    this.data = exNativ.Array.sortBy(this.data, aArgs);
    return this;
};

JsonDB.prototype.select = function (oOpt) {
    if (!oOpt) {
        throw new TypeError("No Options for operation set");
    }

    var that = this;
    var _fFunc;
    switch (oOpt.op) {
        case ">=":
            _fFunc = function (row) {
                if (row[oOpt.col] >= oOpt.param) {
                    return true;
                }
                return false;
            };
            break;
        case "<=":
            _fFunc = function (row) {
                if (row[oOpt.col] <= oOpt.param) {
                    return true;
                }
                return false;
            };
            break;
        case ">":
            _fFunc = function (row) {
                if (row[oOpt.col] > oOpt.param) {
                    return true;
                }
                return false;
            };
            break;
        case "<":
            _fFunc = function (row) {
                if (row[oOpt.col] < oOpt.param) {
                    return true;
                }
                return false;
            };
            break;
        case "!==":
            _fFunc = function (row) {
                if (row[oOpt.col] !== oOpt.param) {
                    return true;
                }
                return false;
            };
            break;
        case "===":
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

JsonDB.prototype.find = function (oOpt) {
    if (!oOpt) {
        throw new TypeError("No Options for operation set");
    }

    var _fFunc;
    switch (oOpt.op) {
        case ">=":
            _fFunc = function (row) {
                if (row[oOpt.col] >= oOpt.param) {
                    return true;
                }
                return false;
            };
            break;
        case "<=":
            _fFunc = function (row) {
                if (row[oOpt.col] <= oOpt.param) {
                    return true;
                }
                return false;
            };
            break;
        case ">":
            _fFunc = function (row) {
                if (row[oOpt.col] > oOpt.param) {
                    return true;
                }
                return false;
            };
            break;
        case "<":
            _fFunc = function (row) {
                if (row[oOpt.col] < oOpt.param) {
                    return true;
                }
                return false;
            };
            break;
        case "!==":
            _fFunc = function (row) {
                if (row[oOpt.col] !== oOpt.param) {
                    return true;
                }
                return false;
            };
            break;
        case "===":
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
