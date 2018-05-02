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
    this.classname = "group";

    // Database fields
    this.fields = fields || {
        "groupID": "    ",
        "sName": "",
        "dtSince": helper.currentTimestamp(),
        "iTasks": 0
    };

    this.mirror = helper.clone(this.fields);

    const that = this;
    // Getter und Setter
    this.get = {
        groupID: function () {
            return that.fields.groupID;
        },
        sName: function () {
            return that.fields.sName;
        },
        dtSince: function () {
            return that.fields.dtSince;
        },
        iTasks: function () {
            return that.fields.iTasks;
        }
    };

    this.set = {
        groupID: function (sID) {
            that.fields.groupID = sID;
        },
        sName: function (sValue) {
            that.fields.sName = sValue;
        },
        dtSince: function (iValue) {
            that.fields.dtSince = iValue;
        },
        iTasks: function (iValue) {
            that.fields.iTasks = iValue;
        }
    };

    // Functions

    /**
     * Creates a JSON-Object to ready to return Data to client.
     * @alias module:classes.Group.toJson
     * @returns {JSON}
     */
    this.toJson = function () {
        return {
            "id": this.get.groupID(),
            "name": this.get.sName(),
            "dtSince": this.get.dtSince(),
            "tasks": this.get.iTasks()
        };
    };

    /**
     * Creates a JSON-Object to ready to return Data to client without any permissions.
     * @alias module:classes.Group.toSafeJson
     * @returns {JSON}
     */
    this.toSafeJson = function () {
        return {
            "id": this.get.groupID(),
            "name": this.get.sName()
        };
    };

};
