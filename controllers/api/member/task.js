"use strict";
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Dependencies
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var helper = require("../../../helper");
var prohelper = require("../../../prohelper");
var config = require("../../../static/config.json");
var Session = require("../../../module/session").Session;
var session = new Session(config.session.member);
var errorcode = helper.getErrorcodes();
var classes = require("../../../classes");
var exNativ = require("../../../module/exNativ");

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// API
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * @api {post} /member/task Add Task (Member)
 * @apiVersion  1.0.0
 * @apiName AddTaskMember
 * @apiGroup Task
 * @apiPermission Member Task.Add
 *
 * @apiDescription Add a new task.
 *
 * @apiParam  {String}      project             ID of an existing project.
 * @apiParam  {String}      status              ID of an existing taskstatus.
 * @apiParam  {String}      type                ID of an existing tasktype.
 * @apiParam  {String}      contact             ID of an existing contact.
 * @apiParam  {Number}      prio                The priority of the task. Number between 1 - 9.
 * @apiParam  {String}      title               The tasks title.
 * @apiParam  {String}      text                A description of the problem/request/task.
 * @apiParam  {String}      [member]            ID of an existing member. Will be the current assigned processor.
 * @apiParam  {Object}      [finish]            The date until the task is finished.
 * @apiParam  {Number}      finish.year
 * @apiParam  {Number}      finish.month
 * @apiParam  {Number}      [finish.day]
 * @apiParam  {Number}      [finish.hour]
 * @apiParam  {Number}      [finish.minute]
 * @apiParam  {Number}      [finish.secound]
 * @apiParam  {Number}      [finish.ms]
 *
 * @apiExample {json} Request Example:
 *      {
 *          "project": "OZ8zgsa",
 *          "status": "QNtvbR6",
 *          "type": "JinoZYu",
 *          "contact": "DHqJxFchV",
 *          "prio": 1,
 *          "title": "My very first Ticket",
 *          "text": "Here is a description how to write a Ticket...",
 *          "member": "hJmGe0TZ",
 *          "finish": {
 *              "year": 2018,
 *              "month": 4,
 *              "day": 4,
 *              "hour": 12,
 *              "minute": 10,
 *              "secound": 0,
 *              "ms": 0
 *          }
 *      }
 *
 * @apiExample {json} Response Example:
 *      HTTP/1.1 200 OK
 *      Content-Type: application/json; charset=utf-8
 *      {
 *          "id": 13
 *      }
 *
 * @apiExample {json} Error-Response Example:
 *      HTTP/1.1 400 Bad Request
 *      Content-Type: application/json; charset=utf-8
 *      {
 *          "SERR": "MissingRequiredValues"
 *      }
 *
 * @apiError    NoCurrentMember         Currently there is no member logged in.
 * @apiError    NotEnoughPermission     Current member has no permission for that action.
 * @apiError    MissingRequiredValues   Required parameters are not set. See response for mission values.
 * @apiError    ProjectNotExist         The id for project is not a project.
 * @apiError    TaskstatusNotExist      The id for status is not a taskstatus.
 * @apiError    TastypeNotExist         The id for type is not a tasktype.
 * @apiError    ContactNotExist         The id for contact is not a contact.
 * @apiError    MemberNotExist          The id for member is not a member.
 */
exports.post = function (req, res) {
    var oTask = new classes.Task();
    var oChange = new classes.Taskchange();
    var oGroup = new classes.Group();
    session.loadSessionData(req, res, prohelper.loadMemberSessionData)
        .then(function () {
            return req.oSessiondata.hasPermission("Task.Add");
        })
        .then(function () {
            return helper.checkRequiredValues([
                ["project", req.body.project],
                ["status", req.body.status],
                ["type", req.body.type],
                ["contact", req.body.contact],
                ["prio", req.body.prio],
                ["title", req.body.title],
                ["text", req.body.text]
            ]);
        })
        .then(function () {
            return __dbhandler.fetch("FetchProjectGroupID", [req.oSessiondata.get.idGroup(), req.body.project]);
        })
        .then(function (aData) {
            if (aData.length === 0) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "ProjectNotExist"
                };
            }
            return __dbhandler.fetch("FetchTaskstatusGroupID", [req.oSessiondata.get.idGroup(), req.body.status]);
        })
        .then(function (aData) {
            if (aData.length === 0) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "TaskstatusNotExist"
                };
            }
            return __dbhandler.fetch("FetchTasktypeGroupID", [req.oSessiondata.get.idGroup(), req.body.type]);
        })
        .then(function (aData) {
            if (aData.length === 0) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "TastypeNotExist"
                };
            }
            return __dbhandler.fetch("FetchContactGroupID", [req.oSessiondata.get.idGroup(), req.body.contact]);
        })
        .then(function (aData) {
            if (aData.length === 0) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "ContactNotExist"
                };
            }
            if (helper.isset(req.body.member)) {
                return __dbhandler.fetch("FetchMemberGroupID", [req.oSessiondata.get.idGroup(), req.body.member]);
            }
            return;
        })
        .then(function (aData) {
            if (helper.isset(aData) && aData.length === 0) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "MemberNotExist"
                };
            }
            return __dbhandler.fetch("FetchGroupID", [req.oSessiondata.get.idGroup()]);
        })
        .then(function (aData) {
            oGroup = new classes.Group(aData[0]);
            oGroup.set.iTasks(oGroup.get.iTasks() + 1);

            oTask.set.iTask(oGroup.get.iTasks());
            oTask.set.idGroup(req.oSessiondata.get.idGroup());
            oTask.set.idProject(req.body.project);
            oTask.set.idTaskstatus(req.body.status);
            oTask.set.idTasktype(req.body.type);
            oTask.set.idContact(req.body.contact);
            oTask.set.sTitle(req.body.title);
            oTask.set.sText(req.body.text);
            oTask.set.iPrio(parseInt(req.body.prio));
            if (helper.isset(req.body.member)) {
                oTask.set.idMember(req.body.member);
            }
            if (helper.isset(req.body.finish) && helper.isObject(req.body.finish)) {
                oTask.set.dtFinish(exNativ.Date.genDate("unix", exNativ.Date.normalize(req.body.finish)));
            }
            return __dbhandler.insert(oTask);
        })
        .then(function () {
            return __dbhandler.update(oGroup);
        })
        .then(function () {
            oChange.set.idTask(oTask.get.taskID());
            oChange.set.idMember(req.oSessiondata.get.memberID());
            oChange.set.sColumn("CreateTask");
            return __dbhandler.insert(oChange);
        })
        .then(function () {
            res.json({
                "id": oTask.get.iTask()
            });
        })
        .catch(function (oErr) {
            prohelper.httpErrorHandler(res, oErr);
        });
};

/**
 * @api {get} /member/task Load Task (Member)
 * @apiVersion  1.0.0
 * @apiName LoadTaskMember
 * @apiGroup Task
 * @apiPermission Member Member.View
 *
 * @apiDescription Load a existing task. With Member.View permission you can load EVERY task. Without only the own tasks.
 *
 * @apiParam  {Number}      id          The numeric ID of a task.
 *
 * @apiExample {json} Request Example:
 *      {
 *          "id": 13
 *      }
 *
 * @apiExample {json} Response Example:
 *      HTTP/1.1 200 OK
 *      Content-Type: application/json; charset=utf-8
 *      {
 *          "id": 13,
 *          "prio": 1,
 *          "idProject": "OZ8zgsa",
 *          "idTaskstatus": "QNtvbR6",
 *          "idTasktype": "JinoZYu",
 *          "idContact": "DHqJxFchV",
 *          "idMember": "hJmGe0TZ",
 *          "dtCreate": 1525443250,
 *          "dtFinish": 1525428600,
 *          "title": "My very first Ticket",
 *          "text": "Here is a description how to write a Ticket...",
 *          "dtClose": null
 *      }
 *
 * @apiExample {json} Error-Response Example:
 *      HTTP/1.1 400 Bad Request
 *      Content-Type: application/json; charset=utf-8
 *      {
 *          "SERR": "TaskNotExist"
 *      }
 *
 * @apiError    NoCurrentMember         Currently there is no member logged in.
 * @apiError    NotEnoughPermission     Current member has no permission for that action.
 * @apiError    MissingRequiredValues   Required parameters are not set. See response for mission values.
 * @apiError    TaskNotExist            A task with the current id doesn't exist
 */
exports.get = function (req, res) {
    var oTask = new classes.Task();
    session.loadSessionData(req, res, prohelper.loadMemberSessionData)
        .then(function () {
            helper.checkRequiredValues([
                ["id", req.query.id]
            ]);
        })
        .then(function () {
            return __dbhandler.fetch("FetchTaskGroupTask", [req.oSessiondata.get.idGroup(), req.query.id]);
        })
        .then(function (aData) {
            if (aData.length === 0) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "TaskNotExist"
                };
            }
            oTask = new classes.Task(aData[0]);
            if (oTask.get.idMember() !== req.oSessiondata.get.memberID()) {
                return req.oSessiondata.hasPermission("Task.View");
            }
            return;
        })
        .then(function () {
            res.json(oTask.toJson());
        })
        .catch(function (oErr) {
            prohelper.httpErrorHandler(res, oErr);
        });
};

/**
 * @api {put} /member/task Change Task
 * @apiVersion  1.0.0
 * @apiName ChangeTaskMember
 * @apiGroup Task
 * @apiPermission Member  | Task.Change | Task.Change.Project | Task.Change.Type | Task.Change.Contact | Task.Change.Finish | Task.Change.Prio | Task.Change.Content
 *
 * @apiDescription Changes the data of an exsisting task. Member can change own tasks every time. For more edition needs more permissions.
 *
 * @apiParam  {String}      id              The id of an existing Task
 * @apiParam  {String}      [member]        ID of an existing member.
 * @apiParam  {String}      [status]        ID of an existing status
 * @apiParam  {String}      [project]       REQUIRE PERMISSION: Task.Change.Project. ID of a existing project.
 * @apiParam  {String}      [type]          REQUIRE PERMISSION: Task.Change.Type. ID of an existing type.
 * @apiParam  {String}      [contact]       REQUIRE PERMISSION: Task.Change.Contact. ID of a existing type.
 * @apiParam  {Object}      [finish]        REQUIRE PERMISSION: Task.Change.Finish. Change the finish date of a task.
 * @apiParam  {Number}      finish.year
 * @apiParam  {Number}      finish.month
 * @apiParam  {Number}      [finish.day]
 * @apiParam  {Number}      [finish.hour]
 * @apiParam  {Number}      [finish.minute]
 * @apiParam  {Number}      [finish.secound]
 * @apiParam  {Number}      [finish.ms]
 * @apiParam  {Number}      [prio]          REQUIRE PERMISSION: Task.Change.Prio. Change the prio of a task.
 * @apiParam  {String}      [title]         REQUIRE PERMISSION: Task.Change.Content. Change the title of the task.
 * @apiParam  {String}      [text]          REQUIRE PERMISSION: Task.Change.Content. Change the mein text of the task.
 *
 * @apiExample {json} Request Example:
 *      {
 *          "id": 11,
 *          "status": "uMj6wpd",
 *          "member": "00000000",
 *          "project": "8VhD0Fe",
 *          "type": "22Tj9DO",
 *          "contact": "000000000",
 *          "finish": {
 *              "year": 2019,
 *              "month": 4,
 *              "day": 4,
 *              "hour": 12,
 *              "minute": 10,
 *              "secound": 0,
 *              "ms": 0
 *          },
 *          "prio": 2,
 *          "title": "This is the new Title for the Task...",
 *          "text": "And here is some added text to the old:\nHere is a description how to write a Ticket...\n\nToday there is more TEEEEEXT..."
 *      }
 *
 * @apiExample {json} Response Example:
 *      HTTP/1.1 200 OK
 *      Content-Type: application/json; charset=utf-8
 *      {
 *          "id": 11
 *      }
 *
 * @apiExample {json} Error-Response Example:
 *      HTTP/1.1 400 Bad Request
 *      Content-Type: application/json; charset=utf-8
 *      {
 *          "SERR": "MissingRequiredValues"
 *      }
 *
 * @apiError    NoCurrentMember         Currently there is no member logged in.
 * @apiError    NotEnoughPermission     Current member has no permission for that action.
 * @apiError    MissingRequiredValues   Required parameters are not set. See response for mission values.
 * @apiError    TaskNotExist            A task with that id doesn't exist.
 * @apiError    ProjectNotExist         The id for project is not a project.
 * @apiError    TaskstatusNotExist      The id for status is not a taskstatus.
 * @apiError    TastypeNotExist         The id for type is not a tasktype.
 * @apiError    ContactNotExist         The id for contact is not a contact.
 * @apiError    MemberNotExist          The id for member is not a member.
 */
exports.put = function (req, res) {
    var oTask = new classes.Task();
    var oChange = new classes.Taskchange();
    session.loadSessionData(req, res, prohelper.loadMemberSessionData)
        .then(function () {
            return helper.checkRequiredValues([
                ["id", req.body.id]
            ]);
        })
        .then(function () {
            return __dbhandler.fetch("FetchTaskGroupTask", [req.oSessiondata.get.idGroup(), req.body.id]);
        })
        .then(function (aData) {
            if (aData.length === 0) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "TaskNotExist"
                };
            }
            oTask = new classes.Task(aData[0]);
            oChange.set.idTask(oTask.get.taskID());
            oChange.set.idMember(req.oSessiondata.get.memberID());
            if (oTask.get.idMember() !== req.oSessiondata.get.memberID()) {
                return req.oSessiondata.hasPermission("Task.Change");
            }
            return;
        })
        .then(function () {
            if (helper.isset(req.body.project) &&
                req.body.project !== oTask.get.idProject() &&
                req.oSessiondata.hasPermission("Task.Change.Project", true)) {
                oChange.resetID();
                return __dbhandler.fetch("FetchProjectGroupID", [req.oSessiondata.get.idGroup(), req.body.project])
                    .then(function (aData) {
                        if (aData.length === 0) {
                            throw {
                                "type": errorcode.ERR_individualError,
                                "SERR": "ProjectNotExist"
                            };
                        }
                        var oProject = new classes.Project(aData[0]);
                        oChange.set.sColumn("ChangeProject");
                        oChange.set.sNewData(oProject.get.sName());
                        oTask.set.idProject(oProject.get.projectID());
                        return __dbhandler.insert(oChange);
                    });
            }
            return;
        })
        .then(function () {
            if (helper.isset(req.body.status) &&
                req.body.status !== oTask.get.idTaskstatus()) {
                oChange.resetID();
                return __dbhandler.fetch("FetchTaskstatusGroupID", [req.oSessiondata.get.idGroup(), req.body.status])
                    .then(function (aData) {
                        if (aData.length === 0) {
                            throw {
                                "type": errorcode.ERR_individualError,
                                "SERR": "TaskstatusNotExist"
                            };
                        }
                        var oStatus = new classes.Taskstatus(aData[0]);
                        oChange.set.sColumn("ChangeStatus");
                        oChange.set.sNewData(oStatus.get.sName());
                        oTask.set.idTaskstatus(oStatus.get.taskstatusID());
                        return __dbhandler.insert(oChange);
                    });
            }
            return;
        })
        .then(function () {
            if (helper.isset(req.body.type) &&
                req.body.type !== oTask.get.idTasktype() &&
                req.oSessiondata.hasPermission("Task.Change.Type", true)) {
                oChange.resetID();
                return __dbhandler.fetch("FetchTasktypeGroupID", [req.oSessiondata.get.idGroup(), req.body.type])
                    .then(function (aData) {
                        if (aData.length === 0) {
                            throw {
                                "type": errorcode.ERR_individualError,
                                "SERR": "TasktypeNotExist"
                            };
                        }
                        var oType = new classes.Tasktype(aData[0]);
                        oChange.set.sColumn("ChangeType");
                        oChange.set.sNewData(oType.get.sName());
                        oTask.set.idTasktype(oType.get.tasktypeID());
                        return __dbhandler.insert(oChange);
                    });
            }
            return;
        })
        .then(function () {
            if (helper.isset(req.body.contact) &&
                req.body.contact !== oTask.get.idContact() &&
                req.oSessiondata.hasPermission("Task.Change.Contact", true)) {
                oChange.resetID();
                return __dbhandler.fetch("FetchContactGroupID", [req.oSessiondata.get.idGroup(), req.body.contact])
                    .then(function (aData) {
                        if (aData.length === 0) {
                            throw {
                                "type": errorcode.ERR_individualError,
                                "SERR": "ContactNotExist"
                            };
                        }
                        var oContact = new classes.Contact(aData[0]);
                        oChange.set.sColumn("ChangeContact");
                        oChange.set.sNewData(oContact.get.sLastname() + ", " + oContact.get.sFirstname());
                        oTask.set.idContact(oContact.get.contactID());
                        return __dbhandler.insert(oChange);
                    });
            }
            return;
        })
        .then(function () {
            if (helper.isset(req.body.member) &&
                req.body.member !== oTask.get.idMember()) {
                oChange.resetID();
                return __dbhandler.fetch("FetchMemberGroupID", [req.oSessiondata.get.idGroup(), req.body.member])
                    .then(function (aData) {
                        if (aData.length === 0) {
                            throw {
                                "type": errorcode.ERR_individualError,
                                "SERR": "MemberNotExist"
                            };
                        }
                        var oMember = new classes.Member(aData[0]);
                        oChange.set.sColumn("ChangeMember");
                        oChange.set.sNewData(oMember.get.sLastname() + ", " + oMember.get.sFirstname());
                        oTask.set.idMember(oMember.get.memberID());
                        return __dbhandler.insert(oChange);
                    });
            }
            return;
        })
        .then(function () {
            if (helper.isset(req.body.finish) &&
                req.oSessiondata.hasPermission("Task.Change.Finish", true)) {
                var iDate = exNativ.Date.genDate("unix", exNativ.Date.normalize(req.body.finish));
                if (iDate === oTask.get.dtFinish()) {
                    return;
                }
                oChange.resetID();
                oChange.set.sColumn("ChangeFinish");
                oTask.set.dtFinish(iDate);
                oChange.set.sNewData(oTask.get.dtFinish());
                return __dbhandler.insert(oChange);
            }
            return;
        })
        .then(function () {
            if (helper.isset(req.body.prio) &&
                req.oSessiondata.hasPermission("Task.Change.Prio", true)) {
                req.body.prio = parseInt(req.body.prio);
                if (req.body.prio === oTask.get.iPrio()) {
                    return;
                }
                oChange.resetID();
                oChange.set.sColumn("ChangePrio");
                oTask.set.iPrio(req.body.prio);
                oChange.set.sNewData(oTask.get.iPrio());
                return __dbhandler.insert(oChange);
            }
            return;
        })
        .then(function () {
            if (helper.isset(req.body.title) &&
                req.oSessiondata.hasPermission("Task.Change.Content", true)) {
                oChange.resetID();
                oChange.set.sColumn("ChangeTitle");
                oTask.set.sTitle(req.body.title);
                return __dbhandler.insert(oChange);
            }
            return;
        })
        .then(function () {
            if (helper.isset(req.body.text) &&
                req.oSessiondata.hasPermission("Task.Change.Content", true)) {
                oChange.resetID();
                oChange.set.sColumn("ChangeText");
                oTask.set.sText(req.body.text);
                return __dbhandler.insert(oChange);
            }
            return;
        })
        .then(function () {
            return __dbhandler.update(oTask);
        })
        .then(function () {
            res.json({
                "id": oTask.get.iTask()
            });
        })
        .catch(function (oErr) {
            prohelper.httpErrorHandler(res, oErr);
        });
};

/**
 * @api {delete} /member/task Delete Task
 * @apiVersion  1.0.0
 * @apiName DeleteTask
 * @apiGroup Task
 * @apiPermission Member Task.Delete
 *
 * @apiDescription Delete a existing Task.
 *
 * @apiParam  {String}      id      The numberic id of a task.
 *
 * @apiExample {json} Request Example:
 *      {
 *          "id": 10
 *      }
 *
 * @apiExample {json} Response Example:
 *      HTTP/1.1 200 OK
 *      Content-Type: text/plain; charset=utf-8
 *
 * @apiExample {json} Error-Response Example:
 *      HTTP/1.1 400 Bad Request
 *      Content-Type: application/json; charset=utf-8
 *      {
 *          "SERR": "TaskNotExist"
 *      }
 *
 * @apiError    NoCurrentMember         Currently there is no member logged in.
 * @apiError    NotEnoughPermission     Current member has no permission for that action.
 * @apiError    MissingRequiredValues   Required parameters are not set. See respnse for mission values.
 * @apiError    TaskNotExist            A task with the current numeric id doesn't exist in the current members group.
 */
exports.delete = function (req, res) {
    var oTask = new classes.Task();
    session.loadSessionData(req, res, prohelper.loadMemberSessionData)
        .then(function () {
            return helper.checkRequiredValues([
                ["id", req.body.id]
            ]);
        })
        .then(function () {
            return req.oSessiondata.hasPermission("Task.Delete");
        })
        .then(function () {
            return __dbhandler.fetch("FetchTaskGroupTask", [req.oSessiondata.get.idGroup(), req.body.id]);
        })
        .then(function (aData) {
            if (aData.length === 0) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "TaskNotExist"
                };
            }
            oTask = new classes.Task(aData[0]);
            return __dbhandler.fetch("DeleteTaskchangeTask", [oTask.get.taskID()]);
        })
        .then(function () {
            return __dbhandler.delete(oTask);
        })
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (oErr) {
            prohelper.httpErrorHandler(res, oErr);
        });
};
