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
    this.classname = "task";

    // Database fields
    this.fields = fields || {
        "taskID": "                ",
        "idGroup": "    ",
        "iTask": 0,
        "iPrio": 0,
        "idProjekt": "       ",
        "idTaskstatus": "       ",
        "idTasktype": "       ",
        "idContact": "         ",
        "idMember": "        ",
        "dtCreate": helper.currentTimestamp(),
        "dtFinish": undefined,
        "sTitle": "",
        "sText": "",
        "dtClose": undefined
    };

    const that = this;
    // Getter und Setter
    this.get = {
        taskID: function () {
            return that.fields.taskID;
        },
        idGroup: function () {
            return that.fields.idGroup;
        },
        iTask: function () {
            return that.fields.iTask;
        },
        iPrio: function () {
            return that.fields.iPrio;
        },
        idProjekt: function () {
            return that.fields.idProjekt;
        },
        idTaskstatus: function () {
            return that.fields.idTaskstatus;
        },
        idTasktype: function () {
            return that.fields.idTasktype;
        },
        idContact: function () {
            return that.fields.idContact;
        },
        idMember: function () {
            return that.fields.idMember;
        },
        dtCreate: function () {
            return that.fields.dtCreate;
        },
        dtFinish: function () {
            return that.fields.dtFinish;
        },
        sTitle: function () {
            return that.fields.sTitle;
        },
        sText: function () {
            return that.fields.sText;
        },
        dtClose: function () {
            return that.fields.dtClose;
        }
    };

    this.set = {
        taskID: function (sID) {
            that.fields.taskID = sID;
        },
        idGroup: function (sID) {
            that.fields.idGroup = sID;
        },
        iTask: function (iValues) {
            that.fields.iTask = iValues;
        },
        iPrio: function (iValues) {
            that.fields.iPrio = iValues;
        },
        idProjekt: function (sID) {
            that.fields.idProjekt = sID;
        },
        idTaskstatus: function (sID) {
            that.fields.idTaskstatus = sID;
        },
        idTasktype: function (sID) {
            that.fields.idTasktype = sID;
        },
        idContact: function (sID) {
            that.fields.idContact = sID;
        },
        idMember: function (sID) {
            that.fields.idMember = sID;
        },
        dtCreate: function (iValues) {
            that.fields.dtCreate = iValues;
        },
        dtFinish: function (iValues) {
            that.fields.dtFinish = iValues;
        },
        sTitle: function (sValues) {
            that.fields.sTitle = sValues;
        },
        sText: function (sValues) {
            that.fields.sText = sValues;
        },
        dtClose: function (iValues) {
            that.fields.dtClose = iValues;
        }
    };

    // Functions

};