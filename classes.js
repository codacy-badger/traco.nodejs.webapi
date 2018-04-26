"use strict";
/**
 * This is a modul wich contains all DBClasses and their contructor explanation.
 * @module
 */
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// exports Classes
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * @class
 * @param {Object} [fields]
 * @param {string} fields.groupID
 * @param {string} fields.sName
 * @param {number} fields.dtSince
 * @param {number} fields.iTasks
 */
exports.Group = require("./classes/group").class;
/**
 * @class
 * @param {Object} [fields]
 * @param {string} fields.memberID
 * @param {string} fields.idGroup
 * @param {string} fields.sUsername
 * @param {string} fields.sPassword
 * @param {string} fields.cPermission
 * @param {number} fields.dtSince
 * @param {string} fields.sEmail
 * @param {string} fields.sFirstname
 * @param {string} fields.sLastname
 */
exports.Member = require("./classes/member").class;
/**
 * @class
 * @param {Object} [fields]
 * @param {string} fields.contactID
 * @param {string} fields.idGroup
 * @param {string} fields.sUsername
 * @param {string} fields.sPassword
 * @param {number} fields.dtSince
 * @param {string} fields.sEmail
 * @param {string} fields.sFirstname
 * @param {string} fields.sLastname
 */
exports.Contact = require("./classes/contact").class;
/**
 * @class
 * @param {Object} [fields]
 * @param {string} fields.projektID
 * @param {string} fields.idGroup
 * @param {string} fields.sName
 * @param {number} fields.dtSince
 * @param {string} fields.sText
 */
exports.Project = require("./classes/project").class;
/**
 * @class
 * @param {Object} [fields]
 * @param {string} fields.taskstatusID
 * @param {string} fields.idGroup
 * @param {string} fields.sName
 * @param {number} fields.iOrder
 */
exports.Taskstatus = require("./classes/taskstatus").class;
/**
 * @class
 * @param {Object} [fields]
 * @param {string} fields.tasktypeID
 * @param {string} fields.idGroup
 * @param {string} fields.sName
 * @param {number} fields.bIntern Boolean number 0 = false | 1 = true
 */
exports.Tasktype = require("./classes/tasktype").class;
/**
 * @class
 * @param {Object} [fields]
 * @param {string} fields.taskID
 * @param {string} fields.idGroup
 * @param {number} fields.iTask
 * @param {number} fields.iPrio
 * @param {string} fields.idProjekt
 * @param {string} fields.idTaskstatus
 * @param {string} fields.idTasktype
 * @param {string} fields.idContact
 * @param {string} fields.idMember
 * @param {number} fields.dtCreate
 * @param {number} fields.dtFinish
 * @param {string} fields.sTitle
 * @param {string} fields.sText
 * @param {number} fields.dtClose
 */
exports.Task = require("./classes/task").class;
/**
 * @class
 * @param {Object} [fields]
 * @param {string} fields.taskchangeID
 * @param {string} fields.idTask
 * @param {string} fields.idMember
 * @param {string} fields.sText
 */
exports.Taskchange = require("./classes/taskchange").class;
/**
 * @class
 * @param {Object} [fields]
 * @param {string} fields.noteID
 * @param {string} fields.idMember
 * @param {number} fields.dtCreate
 * @param {string} fields.sText
 */
exports.Membernote = require("./classes/membernote").class;
