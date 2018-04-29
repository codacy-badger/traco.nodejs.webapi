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
    this.classname = "project";

    // Database fields
    this.fields = fields || {
        "projektID": "       ",
        "idGroup": "    ",
        "sName": "",
        "dtSince": helper.currentTimestamp(),
        "sText": ""
    };

    const that = this;
    // Getter und Setter
    this.get = {
        projectID: function () {
            return that.fields.projectID;
        },
        idGroup: function () {
            return that.fields.idGroup;
        },
        sName: function () {
            return that.fields.sName;
        },
        dtSince: function () {
            return that.fields.dtSince;
        },
        sText: function () {
            return that.fields.sText;
        }
    };

    this.set = {
        projectID: function (sID) {
            that.fields.projectID = sID;
        },
        idGroup: function (sID) {
            that.fields.idGroup = sID;
        },
        sName: function (sValue) {
            that.fields.sName = sValue;
        },
        dtSince: function (iValue) {
            that.fields.dtSince = iValue;
        },
        sText: function (sValue) {
            that.fields.sText = sValue;
        }
    };

    // Functions

    /**
     * Creates a JSON-Object to ready to return Data to client.
     * @alias module:classes.Project.toJson
     * @returns {JSON}
     */
    this.toJson = function () {
        return {
            "id": this.get.projektID(),
            "name": this.get.sName(),
            "dtSince": this.get.dtSince(),
            "text": this.get.sText()
        };
    };

};
