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
        "projectID": "       ",
        "idGroup": "    ",
        "sName": "",
        "dtSince": helper.currentTimestamp(),
        "sText": "",
        "bIntern": 0
    };

    this.mirror = helper.clone(this.fields);

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
        },
        bIntern: function () {
            return that.fields.bIntern;
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
        },
        bIntern: function (iValue) {
            that.fields.bIntern = iValue;
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
            "id": this.get.projectID(),
            "name": this.get.sName(),
            "dtSince": this.get.dtSince(),
            "text": this.get.sText(),
            "intern": helper.isTrue(this.get.bIntern())
        };
    };

};
