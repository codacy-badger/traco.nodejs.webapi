"use strict";
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Dependencies
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// DATABASE CLASSES
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
exports.class = function (fields) {
    // Class properties
    this.classname = "taskstatus";

    // Database fields
    this.fields = fields || {
        "taskstatusID": "       ",
        "idGroup": "    ",
        "sName": "",
        "iOrder": 0
    };

    const that = this;
    // Getter und Setter
    this.get = {
        taskstatusID: function () {
            return that.fields.taskstatusID;
        },
        idGroup: function () {
            return that.fields.idGroup;
        },
        sName: function () {
            return that.fields.sName;
        },
        iOrder: function () {
            return that.fields.iOrder;
        }
    };

    this.set = {
        taskstatusID: function (sID) {
            that.fields.taskstatusID = sID;
        },
        idGroup: function (sID) {
            that.fields.idGroup = sID;
        },
        sName: function (svalue) {
            that.fields.sName = svalue;
        },
        iOrder: function (iValue) {
            that.fields.iOrder = iValue;
        }
    };

    // Functions

    /**
     * Creates a JSON-Object to ready to return Data to client.
     * @alias module:classes.Taskstatus.toJson
     * @returns {JSON}
     */
    this.toJson = function () {
        return {
            "id": this.get.taskstatusID(),
            "name": this.get.sName(),
            "order": this.get.iOrder()
        };
    };

};
