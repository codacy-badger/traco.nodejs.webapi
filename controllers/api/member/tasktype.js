"use strict";
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Dependencies
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var helper = require("../../../helper");
var prohelper = require("../../../prohelper");
var config = require("../../../static/config.json");
var Session = require("../../../module/session").Session;
var session = new Session(config.session.member);
var classes = require("../../../classes");
var errorcode = helper.getErrorcodes();

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// API
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * @api {post} /member/tasktype Add Tasktype
 * @apiVersion  1.0.0
 * @apiName AddTasktype
 * @apiGroup Tasktype
 * @apiPermission Member Taskstatus.Add
 *
 * @apiDescription Add a new tasktype for the current members group.
 *
 * @apiParam  {String}      name        The name for the new tasktype.
 * @apiParam  {Boolean}     [intern]    Is this type just shown for member or also for contacts.
 *
 * @apiExample {json} Request Example:
 *      {
 *          "name": "Request",
 *          "intern": false
 *      }
 *
 * @apiExample {json} Response Example:
 *      HTTP/1.1 200 OK
 *      Content-Type: application/json; charset=utf-8
 *      {
 *          "id": "FMvFP4M"
 *      }
 *
 * @apiExample {json} Error-Response Example:
 *      HTTP/1.1 400 Bad Request
 *      Content-Type: application/json; charset=utf-8
 *      {
 *          "SERR": "TasktypeAlreadyExist"
 *      }
 *
 * @apiError    NoCurrentMember         Currently there is no member logged in.
 * @apiError    NotEnoughPermission     Current member has no permission for that action.
 * @apiError    MissingRequiredValues   Required parameters are not set. See respnse for mission values.
 * @apiError    TasktypeAlreadyExist    A tasktype with this name already exist.
 */
exports.post = function (req, res) {
    var oType = new classes.Tasktype();
    session.loadSessionData(req, res, prohelper.loadMemberSessionData)
        .then(function () {
            return req.oSessiondata.hasPermission("Tasktype.Add");
        })
        .then(function () {
            return helper.checkRequiredValues([
                ["name", req.body.name]
            ]);
        })
        .then(function () {
            return __dbhandler.fetch("FetchTasktypeGroupName", [req.oSessiondata.get.idGroup(), req.body.name]);
        })
        .then(function (aData) {
            if (aData.length !== 0) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "TasktypeAlreadyExist"
                };
            }
            oType.set.idGroup(req.oSessiondata.get.idGroup());
            oType.set.sName(req.body.name);
            if (helper.isset(req.body.intern)) {
                oType.set.bIntern(helper.isTrue(req.body.intern, true));
            }
            return __dbhandler.insert(oType);
        })
        .then(function () {
            res.json({
                "id": oType.get.tasktypeID()
            });
        })
        .catch(function (oErr) {
            prohelper.httpErrorHandler(res, oErr);
        });
};

/**
 * @api {get} /member/tasktype Load Tasktype
 * @apiVersion  1.0.0
 * @apiName LoadTasktype
 * @apiGroup Tasktype
 * @apiPermission Member Tasktype.View
 *
 * @apiDescription Load a existing tasktype.
 *
 * @apiParam  {String}      id      The id of an existing tasktype.
 *
 * @apiExample {json} Request Example:
 *      {
 *          "id": "FMvFP4M"
 *      }
 *
 * @apiExample {json} Response Example:
 *      HTTP/1.1 200 OK
 *      Content-Type: application/json; charset=utf-8
 *      {
 *          "id": "FMvFP4M",
 *          "name": "Request",
 *          "intern": false
 *      }
 *
 * @apiExample {json} Error-Response Example:
 *      HTTP/1.1 400 Bad Request
 *      Content-Type: application/json; charset=utf-8
 *      {
 *          "SERR": "TasktypeNotExist"
 *      }
 *
 * @apiError    NoCurrentMember         Currently there is no member logged in.
 * @apiError    NotEnoughPermission     Current member has no permission for that action.
 * @apiError    MissingRequiredValues   Required parameters are not set. See respnse for mission values.
 * @apiError    TasktypeNotExist        A tasktype with the current requested id doesn't exist.
 */
exports.get = function (req, res) {
    var oType = new classes.Tasktype();
    session.loadSessionData(req, res, prohelper.loadMemberSessionData)
        .then(function () {
            return req.oSessiondata.hasPermission("Tasktype.View");
        })
        .then(function () {
            return helper.checkRequiredValues([
                ["id", req.query.id]
            ]);
        })
        .then(function () {
            return __dbhandler.fetch("FetchTasktypeGroupID", [req.oSessiondata.get.idGroup(), req.query.id]);
        })
        .then(function (aData) {
            if (aData.length === 0) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "TasktypeNotExist"
                };
            }
            oType = new classes.Tasktype(aData[0]);
            return;
        })
        .then(function () {
            res.json(oType.toJson());
        })
        .catch(function (oErr) {
            prohelper.httpErrorHandler(res, oErr);
        });
};

/**
 * @api {put} /member/tasktype Change Tasktype
 * @apiVersion  1.0.0
 * @apiName ChangeTasktype
 * @apiGroup Tasktype
 * @apiPermission Member Tasktype.Change
 *
 * @apiDescription Change an existing tasktype.
 *
 * @apiParam  {String}      id          A id of an existing tasktype.
 * @apiParam  {String}      [name]      A new name for the tasktype.
 * @apiParam  {String}      [intern]    Is the tasktype only visible for member or also for contacts.
 *
 * @apiExample {json} Request Example:
 *      {
 *          "id": "FMvFP4M",
 *          "name": "Request 2.0",
 *          "intern": false
 *      }
 *
 * @apiExample {json} Response Example:
 *      HTTP/1.1 200 OK
 *      Content-Type: application/json; charset=utf-8
 *      {
 *          "id": "FMvFP4M"
 *      }
 *
 * @apiExample {json} Error-Response Example:
 *      HTTP/1.1 400 Bad Request
 *      Content-Type: application/json; charset=utf-8
 *      {
 *          "SERR": "TasktypeNotExist"
 *      }
 *
 * @apiError    NoCurrentMember         Currently there is no member logged in.
 * @apiError    NotEnoughPermission     Current member has no permission for that action.
 * @apiError    MissingRequiredValues   Required parameters are not set. See respnse for mission values.
 * @apiError    TasktypeNotExist        A tasktype with the current requested id doesn't exist.
 * @apiError    TasktypeAlreadyExist    A tasktype with this name already exist.
 */
exports.put = function (req, res) {
    var oType = new classes.Tasktype();
    session.loadSessionData(req, res, prohelper.loadMemberSessionData)
        .then(function () {
            return req.oSessiondata.hasPermission("Tasktype.Change");
        })
        .then(function () {
            return helper.checkRequiredValues([
                ["id", req.body.id]
            ]);
        })
        .then(function () {
            return __dbhandler.fetch("FetchTasktypeGroupID", [req.oSessiondata.get.idGroup(), req.body.id]);
        })
        .then(function (aData) {
            if (aData.length === 0) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "TasktypeNotExist"
                };
            }
            oType = new classes.Tasktype(aData[0]);
            return;
        })
        .then(function () {
            if (helper.isset(req.body.name) &&
                req.body.name !== "" &&
                req.body.name !== oType.get.sName()) {
                return __dbhandler.fetch("FetchTasktypeGroupName", [req.oSessiondata.get.idGroup(), req.body.name]);
            }
            return;
        })
        .then(function (aData) {
            if (helper.isset(aData) && aData.length !== 0) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "TasktypeAlreadyExist"
                };
            }

            if (helper.isset(req.body.name) &&
                req.body.name !== "") {
                oType.set.sName(req.body.name);
            }
            if (helper.isset(req.body.intern)) {
                oType.set.bIntern(helper.isTrue(req.body.intern, true));
            }
            return __dbhandler.update(oType);
        })
        .then(function () {
            res.json({
                "id": oType.get.tasktypeID()
            });
        })
        .catch(function (oErr) {
            prohelper.httpErrorHandler(res, oErr);
        });
};

/**
 * @api {delete} /member/tasktype Delete Tasktype
 * @apiVersion  1.0.0
 * @apiName DeleteTasktype
 * @apiGroup Tasktype
 * @apiPermission Member Tasktype.Delete
 *
 * @apiDescription Delete a existing tasktype.
 *
 * @apiParam  {String}      id      A id of an existing tasktype.
 *
 * @apiExample {json} Request Example:
 *      {
 *          "id": "FMvFP4M"
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
 *          "SERR": "TasktypeNotExist"
 *      }
 *
 * @apiError    NoCurrentMember         Currently there is no member logged in.
 * @apiError    NotEnoughPermission     Current member has no permission for that action.
 * @apiError    MissingRequiredValues   Required parameters are not set. See respnse for mission values.
 * @apiError    TasktypeNotExist        A tasktype with the current requested id doesn't exist.
 */
exports.delete = function (req, res) {
    var oType = new classes.Tasktype();
    session.loadSessionData(req, res, prohelper.loadMemberSessionData)
        .then(function () {
            return req.oSessiondata.hasPermission("Tasktype.Delete");
        })
        .then(function () {
            return helper.checkRequiredValues([
                ["id", req.body.id]
            ]);
        })
        .then(function () {
            return __dbhandler.fetch("FetchTasktypeGroupID", [req.oSessiondata.get.idGroup(), req.body.id]);
        })
        .then(function (aData) {
            if (aData.length === 0) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "TasktypeNotExist"
                };
            }
            oType = new classes.Tasktype(aData[0]);
            return __dbhandler.delete(oType);
        })
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (oErr) {
            prohelper.httpErrorHandler(res, oErr);
        });
};
