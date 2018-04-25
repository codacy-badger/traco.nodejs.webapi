"use strict";
/** @module */
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Dependencies
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var exArray = require("./exNativ/array");

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Functions
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var isset = function (oItem) {
    return oItem !== null && oItem !== undefined;
};

var getOperation = function (sOperator) {
    switch (sOperator) {
        case ">=":
            return function (data, param) {
                if (data >= param && isset(data)) {
                    return true;
                }
                return false;
            };
        case "<=":
            return function (data, param) {
                if (data <= param && isset(data)) {
                    return true;
                }
                return false;
            };
        case ">":
            return function (data, param) {
                if (data > param && isset(data)) {
                    return true;
                }
                return false;
            };
        case "<":
            return function (data, param) {
                if (data < param && isset(data)) {
                    return true;
                }
                return false;
            };
        case "!==":
            return function (data, param) {
                if (data !== param && isset(data)) {
                    return true;
                }
                return false;
            };
        case "===":
            return function (data, param) {
                if (data === param) {
                    return true;
                }
                return false;
            };
        default:
            return function () {
                return false;
            };
    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Exports
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * @constructor
 * @param {Object[]|string[]|Object} [iniData]
 */
var JsonTable = function (iniData) {
    /** @default */
    this.cols = [];
    /** @default */
    this.data = [];
    /**
     * Hold every position where the the select Statement is true in this.data.
     * @default
     */
    this.index = undefined;
    /**
     * Hold the select Statement for the current index.
     * @default
     */
    this.indexselect = undefined;

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
 * Define ALL collumns of the table and reset them already set.
 * @param {string[]} aCols
 * @returns {JsonTable}
 */
JsonTable.prototype.setCols = function (aCols) {
    if (this.data.length !== 0) {
        throw new TypeError("Data already set! Can't change collumns!");
    }
    if (!aCols) {
        throw new TypeError("No collumns given");
    }
    if (this.cols.length !== 0) {
        console.warn("Collumns already set! Overwrite old collumns!"); // eslint-disable-line
    }

    this.cols = aCols;
    return this;
};

/**
 * Adds a new collumn.
 * @param {string} sCol
 * @param {any} [oDefault]
 * @returns {JsonTable}
 */
JsonTable.prototype.addCol = function (sCol, oDefault) {
    if (!sCol) {
        throw new TypeError("No collumn given");
    }
    if (this.cols.includes(sCol)) {
        console.warn("Collumn already defined"); // eslint-disable-line
        return this;
    }

    this.cols.push(sCol);
    if (!oDefault) {
        oDefault = null;
    }
    for (var i = 0; i < this.data.length; i += 1) {
        this.data[i][sCol] = oDefault;
    }
    return this;
};

/**
 * Removes the collumn from the table.
 * @param {string} sCol
 * @returns {JsonTable}
 */
JsonTable.prototype.dropCol = function (sCol) {
    if (!sCol) {
        throw new TypeError("No collumn given");
    }
    if (!this.cols.includes(sCol)) {
        console.warn("Collumn doesn't exists"); // eslint-disable-line
        return this;
    }

    exArray.removeStr(this.cols, sCol);
    for (var i = 0; i < this.data.length; i += 1) {
        delete this.data[i][sCol];
    }
    return this;
};

/**
 * Generates a rowset from the table collumns.
 * @return {Object}
 */
JsonTable.prototype.getRowset = function () {
    if (this.cols.length === 0) {
        throw new TypeError("No collumns set");
    }

    var oRow = {};
    var i = 0;
    while (i < this.cols.length) {
        oRow[this.cols[i]] = null;
        i += 1;
    }
    return oRow;
};

/**
 * Insert a dataset wich has the collumns like a getRowset() return.
 * @param {Object} oRow
 * @returns {JsonTable}
 */
JsonTable.prototype.insert = function (oRow) {
    if (!oRow) {
        throw new TypeError("No data for insert");
    }
    if (!(oRow instanceof Object)) {
        throw new TypeError("Wrong datatype for insert");
    }

    var aCols = Object.keys(oRow);
    if (this.cols.length === 0) {
        this.setCols(aCols);
    } else if (!exArray.compare(this.cols, aCols)) {
        throw new TypeError("Wrong dataset for insert");
    }
    this.data.push(oRow);
    return this;
};

/**
 * Insert an array of data into the table.
 * @param {Object[]} aRows
 * @returns {JsonTable}
 */
JsonTable.prototype.insertMulti = function (aRows) {
    if (!aRows) {
        throw new TypeError("No data for insert");
    }
    if (!(aRows instanceof Array)) {
        throw new TypeError("Wrong datatype for multi insert");
    }

    for (var i = 0; i < aRows.length; i += 1) {
        this.insert(aRows[i]);
    }
    return this;
};

/**
 * Reset the complete table.
 * @returns {JsonTable}
 */
JsonTable.prototype.dropTable = function () {
    this.cols = [];
    this.data = [];
    this.index = undefined;
    this.indexselect = undefined;
    return this;
};

/**
 * Creates a new Instance of the class with same data.
 * @returns {JsonTable}
 */
JsonTable.prototype.copy = function () {
    var copyTable = new JsonTable();
    copyTable.cols = this.cols;
    copyTable.data = this.data;
    copyTable.index = this.index;
    copyTable.indexselect = this.indexselect;
    return copyTable;
};

/**
 * Creates a unique array from the values in the given collumn.
 * @param {string} sCol
 * @returns {any[]}
 */
JsonTable.prototype.unique = function (sCol) {
    if (!sCol) {
        throw new TypeError("No collumn given");
    }
    if (!this.cols.includes(sCol)) {
        throw new TypeError("Collumn doesn't exist");
    }

    var aValues = [];
    if (this.index) {
        for (let i = 0; i < this.index.length; i += 1) {
            aValues.push(this.data[this.index[i]][sCol]);
        }
    } else {
        for (let i = 0; i < this.data.length; i += 1) {
            aValues.push(this.data[i][sCol]);
        }
    }


    return exArray.unique(aValues);
};

/**
 * Reorder the data in the JsonTable.
 * @param {Object[]} aOrder
 * @param {string} aOrder.col
 * @param {string} aOrder.order ASC|DESC
 * @returns {JsonTable}
 */
JsonTable.prototype.orderBy = function (aOrder) {
    if (!aOrder || aOrder.length === 0) {
        throw new TypeError("No order request");
    }

    var aArgs = [];
    if (this.data.length === 0) {
        return this;
    }
    for (var i = 0; i < aOrder.length; i += 1) {
        if (!this.cols.includes(aOrder[i].col)) {
            throw new TypeError("Collumn '" + aOrder[i].col + "' doesn't exist");
        }
        if (aOrder[i].order.toUpperCase() === "ASC") {
            aArgs.push(aOrder[i].col);
        } else if (aOrder[i].order.toUpperCase() === "DESC") {
            aArgs.push("-" + aOrder[i].col);
        }
    }
    exArray.sortBy(this.data, aArgs);
    if (this.indexselect) {
        this.select(this.indexselect);
    }
    return this;
};

/**
 *
 * @param {Object} [oOptions] If nothing set deselect the selected index;
 * @param {string} oOptions.col
 * @param {string} oOptions.op
 * @param {any} oOptions.param
 * @returns {JsonTable}
 */
JsonTable.prototype.select = function (oOptions) {
    if (!oOptions) {
        this.index = undefined;
        this.indexselect = undefined;
        return this;
    }

    if (!oOptions.op) {
        throw new TypeError("No operation");
    }
    if (!oOptions.col) {
        throw new TypeError("No collumn");
    }
    if (!this.cols.includes(oOptions.col)) {
        throw new TypeError("Collumn doesn't exist");
    }
    if (!oOptions.hasOwnProperty("param")) {
        throw new TypeError("No parameter value");
    }

    this.indexselect = oOptions;
    var fFunc = getOperation(oOptions.op);
    var i = 0;
    this.index = [];
    while (i < this.data.length) {
        if (fFunc(this.data[i][oOptions.col], oOptions.param)) {
            this.index.push(i);
        }
        i += 1;
    }
    return this;
};

/**
 * Returns the complete this.data or the indexed selected data.
 * @returns {any[]}
 */
JsonTable.prototype.getData = function () {
    if (!this.index) {
        return this.data;
    }
    var aData = [];
    for (var i = 0; i < this.index.length; i += 1) {
        aData.push(this.data[this.index[i]]);
    }
    return aData;
};

/**
 * Set on the selected or any row the value in the col
 * @param {string} sCol
 * @param {any} oValue
 * @returns {JsonTable}
 */
JsonTable.prototype.set = function (sCol, oValue) {
    if (!sCol) {
        throw new TypeError("No collumn");
    }
    if (!this.cols.includes(sCol)) {
        throw new TypeError("Collumn doesn't exist");
    }

    if (this.index) {
        for (let i = 0; i < this.index.length; i += 1) {
            this.data[this.index[i]][sCol] = oValue;
        }
    } else {
        for (let i = 0; i < this.data.length; i += 1) {
            this.data[i][sCol] = oValue;
        }
    }
    return this;
};

JsonTable.prototype.delete = function () {
    if (!this.index) {
        var aCols = this.cols;
        this.dropTable();
        this.setCols(aCols);
        return this;
    }
    for (var i = 0; i < this.index.length; i += 1) {
        exArray.removePos(this.data, this.index[i] - i);
    }
    this.select();
    return this;
};

/**
 * Generates a new JsonTable where the secound table join the first table with the options parameters.
 * @param {JsonTable} oTable
 * @param {Object} oOptions
 * @param {string[]} oOptions.colnames New collumns
 * @param {string[]} oOptions.coltable1 from table1 = this
 * @param {string[]} oOptions.coltable2 from table2 = oTable
 * @param {Object} oOptions.oOpt
 * @param {string} oOptions.oOpt.col1 col from table1
 * @param {string} oOptions.oOpt.col2 col from table2
 * @returns {JsonTable}
 */
JsonTable.prototype.join = function (oTable, oOptions) {
    if (!oTable || !(oTable instanceof JsonTable)) {
        throw new TypeError("No table for join");
    }
    if (!oOptions) {
        throw new TypeError("No join options");
    }
    if (!oOptions.colnames) {
        throw new TypeError("No collumns for new table");
    }
    if (!this.cols.includes(oOptions.oOpt.col1)) {
        throw new TypeError("Table 1 join collumn doesn't exist");
    }
    if (!oTable.cols.includes(oOptions.oOpt.col2)) {
        throw new TypeError("Table 2 join collumn doesn't exist");
    }

    var oNew = new JsonTable();
    var aCols = oOptions.colnames;
    oNew.setCols(aCols);
    var row;
    for (var i = 0; i < this.data.length; i += 1) {
        row = oNew.getRowset();
        for (var n = 0; n < aCols.length; n += 1) {
            oTable.select({
                col: oOptions.oOpt.col2,
                op: "===",
                param: this.data[i][oOptions.oOpt.col1]
            });
            if (n < oOptions.coltable1.length) {
                row[aCols[n]] = this.data[i][oOptions.coltable1[n]];
            } else {
                row[aCols[n]] = oTable.getData()[0][oOptions.coltable2[n - oOptions.coltable1.length]];
            }
        }

        oNew.insert(row);
    }
    return oNew;
};

exports.JsonTable = JsonTable;
