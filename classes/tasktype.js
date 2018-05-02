"use strict";
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Dependencies
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var helper = require("../helper");

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// DATABASE CLASSES
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
exports.class = function (fields) {
    // Class properties
    this.classname = "tasktype";

    // Database fields
    this.fields = fields || {
        "tasktypeID": "       ",
        "idGroup": "    ",
        "sName": "",
        "bIntern": 0
    };

    this.mirror = helper.clone(this.fields);

    const that = this;
    // Getter und Setter
    this.get = {
        tasktypeID: function () {
            return that.fields.tasktypeID;
        },
        idGroup: function () {
            return that.fields.idGroup;
        },
        sName: function () {
            return that.fields.sName;
        },
        bIntern: function () {
            return that.fields.bIntern;
        }
    };

    this.set = {
        tasktypeID: function (sID) {
            that.fields.tasktypeID = sID;
        },
        idGroup: function (sID) {
            that.fields.idGroup = sID;
        },
        sName: function (sValue) {
            that.fields.sName = sValue;
        },
        bIntern: function (iValue) {
            that.fields.bIntern = iValue;
        }
    };

    // Functions

    /**
     * Creates a JSON-Object to ready to return Data to client.
     * @alias module:classes.Tasktype.toJson
     * @returns {JSON}
     */
    this.toJson = function () {
        return {
            "id": this.get.tasktypeID(),
            "name": this.get.sName(),
            "intern": helper.isTrue(this.get.bIntern())
        };
    };

};
