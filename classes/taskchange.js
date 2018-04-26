"use strict";
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Dependencies
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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

};
