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
        "iTasks": 0,
        "dtDeactivate": undefined
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
        },
        dtDeactivate: function () {
            return that.fields.dtDeactivate;
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
        },
        dtDeactivate: function (iValue) {
            that.fields.dtDeactivate = iValue;
        }
    };

    // Functions

    /**
     * Creates a JSON-Object to ready to return Data to client. Differend modes for unauthorized|session|(master)
     * @alias module:classes.Group.toJson
     * @param {string} sType
     * @returns {JSON}
     */
    this.toJson = function (sType) {
        switch (sType) {
            case "safe":
                return {
                    "id": this.get.groupID(),
                    "name": this.get.sName()
                };
            case "session":
                return {
                    "name": this.get.sName(),
                    "dtSince": this.get.dtSince(),
                    "tasks": this.get.iTasks(),
                    "dtDeactivate": this.get.dtDeactivate()
                };
            default:
                return {
                    "id": this.get.groupID(),
                    "name": this.get.sName(),
                    "dtSince": this.get.dtSince(),
                    "tasks": this.get.iTasks(),
                    "dtDeactivate": this.get.dtDeactivate()
                };
        }
    };

};
