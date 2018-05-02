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
    this.classname = "taskchange";

    // Database fields
    this.fields = fields || {
        "taskchangeID": "                    ",
        "idTask": "                ",
        "idMember": "        ",
        "sText": ""
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
        sText: function () {
            return that.fields.sText;
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
        sText: function (sValue) {
            that.fields.sText = sValue;
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
            "text": this.get.sText()
        };
    };

};
