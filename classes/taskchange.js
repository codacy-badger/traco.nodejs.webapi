"use strict";
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Dependencies
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var helper = require("../helper");
var sResetID = "                    ";

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// DATABASE CLASSES
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
exports.class = function (fields) {
    // Class properties
    this.classname = "taskchange";

    // Database fields
    this.fields = fields || {
        "taskchangeID": sResetID,
        "idTask": "                ",
        "idMember": "        ",
        "sColumn": "",
        "sNewData": "",
        "dtCreate": helper.currentTimestamp()
    };

    this.mirror = helper.clone(this.fields);

    const that = this;
    // Getter und Setter
    this.get = {
        taskchangeID: function () {
            return that.fields.taskchangeID;
        },
        idTask: function () {
            return that.fields.idTask;
        },
        idMember: function () {
            return that.fields.idMember;
        },
        sColumn: function () {
            return that.fields.sColumn;
        },
        sNewData: function () {
            return that.fields.sNewData;
        },
        dtCreate: function () {
            return that.fields.dtCreate;
        }
    };

    this.set = {
        taskchangeID: function (sID) {
            that.fields.taskchangeID = sID;
        },
        idTask: function (sID) {
            that.fields.idTask = sID;
        },
        idMember: function (sID) {
            that.fields.idMember = sID;
        },
        sColumn: function (sValue) {
            that.fields.sColumn = sValue;
        },
        sNewData: function (sValue) {
            that.fields.sNewData = sValue;
        },
        dtCreate: function (iValue) {
            that.fields.dtCreate = iValue;
        }
    };

    // Functions

    /**
     * Creates a JSON-Object to ready to return Data to client.
     * @alias module:classes.Taskchange.toJson
     * @returns {JSON}
     */
    this.toJson = function () {
        return {
            "idMember": this.get.idMember(),
            "column": this.get.sColumn(),
            "new": this.get.sNewData(),
            "dtCreate": this.get.dtCreate()
        };
    };

    /**
     * Resets the id of the Taskchange for insert new change with old data.
     * @alias module:classes.Taskchange.resetID
     * @returns {void}
     */
    this.resetID = function () {
        this.set.taskchangeID(sResetID);
        this.set.sColumn("");
        this.set.sNewData("");
        return;
    };

};
