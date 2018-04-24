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
var JsonDB;

JsonDB.prototype.getData = function () {
    return this.data;
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
