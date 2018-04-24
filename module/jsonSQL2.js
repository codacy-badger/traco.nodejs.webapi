"use strict";
/** @module */
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Dependencies
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var exNativ = require("./exNativ");

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Exports
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * @constructor
 * @param {Object[]|string[]|Object} [iniData]
 */
var JsonTable = function (iniData) {
    this.cols = [];
    this.data = [];

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

    exNativ.Array.removeStr(this.cols, sCol);
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
    } else if (!exNativ.Array.compare(this.cols, aCols)) {
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
    return copyTable;
};

exports.JsonTable = JsonTable;
