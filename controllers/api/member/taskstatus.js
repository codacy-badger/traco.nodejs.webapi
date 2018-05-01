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
 * @api {post} /member/taskstatus Add Taskstatus
 * @apiVersion  1.0.0
 * @apiName AddTaskstatus
 * @apiGroup Taskstatus
 * @apiPermission Member Taskstatus.Add
 *
 * @apiDescription Add a new taskstatus for the current members group.
 *
 * @apiParam  {String}      name        The name for the new taskstatus.
 *
 * @apiExample {json} Request Example:
 *      {
 *          "name": "In Progress"
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
 * @apiError    NoCurrentMember             Currently there is no member logged in.
 * @apiError    NotEnoughPermission         Current member has no permission for that action.
 * @apiError    TaskstatusAlreadyExist      A taskstatus with this name already exist.
 */
exports.post = function (req, res) {
    var oStatus = new classes.Taskstatus();
    session.loadSessionData(req, res, prohelper.loadMemberSessionData)
        .then(function () {
            return req.oSessiondata.hasPermission("Taskstatus.Add");
        })
        .then(function () {
            return helper.checkRequiredValues([
                ["name", req.body.name]
            ]);
        })
        .then(function () {
            return __dbhandler.fetch("FetchTaskstatusGroupName", [req.oSessiondata.get.idGroup(), req.body.name]);
        })
        .then(function (aData) {
            if (aData.length !== 0) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "TaskstatusAlreadyExist"
                };
            }
            oStatus.set.idGroup(req.oSessiondata.get.idGroup());
            oStatus.set.sName(req.body.name);
            return __dbhandler.fetch("FetchTaskstatusGroupNextorder", [req.oSessiondata.get.idGroup()]);
        })
        .then(function (aData) {
            var oLaststatus = new classes.Taskstatus(aData[0]);
            if (aData.length === 0) {
                oLaststatus.set.iOrder(0);
            }
            oStatus.set.iOrder(oLaststatus.get.iOrder() + 1);
            return __dbhandler.insert(oStatus);
        })
        .then(function () {
            res.json({
                "id": oStatus.get.taskstatusID()
            });
        })
        .catch(function (oErr) {
            prohelper.httpErrorHandler(res, oErr);
        });
};

/**
 * @api {get} /member/taskstatus Load Taskstatus
 * @apiVersion  1.0.0
 * @apiName LoadTaskstatus
 * @apiGroup Taskstatus
 * @apiPermission Member Taskstatus.View
 *
 * @apiDescription Load a existing Taskstatus.
 *
 * @apiParam  {String}      id      The id of an existing taskstatus.
 *
 * @apiExample {json} Request Example:
 *      {
 *          "id": "SP0OqZf"
 *      }
 *
 * @apiExample {json} Response Example:
 *      HTTP/1.1 200 OK
 *      Content-Type: application/json; charset=utf-8
 *      {
 *          "id": "SP0OqZf",
 *          "name": "In Progress",
 *          "order": 3
 *      }
 *
 * @apiExample {json} Error-Response Example:
 *      HTTP/1.1 400 Bad Request
 *      Content-Type: application/json; charset=utf-8
 *      {
 *          "SERR": "TaskstatusNotExist"
 *      }
 *
 * @apiError    NoCurrentMember         Currently there is no member logged in.
 * @apiError    NotEnoughPermission     Current member has no permission for that action.
 * @apiError    TaskstatusNotExist      A taskstatus with the current requested id doesn't exist.
 */
exports.get = function (req, res) {
    var oStatus = new classes.Taskstatus();
    session.loadSessionData(req, res, prohelper.loadMemberSessionData)
        .then(function () {
            return req.oSessiondata.hasPermission("Taskstatus.View");
        })
        .then(function () {
            return helper.checkRequiredValues([
                ["id", req.query.id]
            ]);
        })
        .then(function () {
            return __dbhandler.fetch("FetchTaskstatusGroupID", [req.oSessiondata.get.idGroup(), req.query.id]);
        })
        .then(function (aData) {
            if (aData.length === 0) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "TaskstatusNotExist"
                };
            }
            oStatus = new classes.Taskstatus(aData[0]);
            return;
        })
        .then(function () {
            res.json(oStatus.toJson());
        })
        .catch(function (oErr) {
            prohelper.httpErrorHandler(res, oErr);
        });
};

/**
 * @api {put} /member/taskstatus Change Taskstatus
 * @apiVersion  1.0.0
 * @apiName ChangeTaskstatus
 * @apiGroup Taskstatus
 * @apiPermission Member Taskstatus.Change
 *
 * @apiDescription Change a existing taskstatus for the current members group.
 *
 * @apiParam  {String}      id          A id of a existing taskstatus.
 * @apiParam  {String}      [name]      The name for the new taskstatus.
 * @apiParam  {Number}      [order]     Set a new order number.
 *
 * @apiExample {json} Request Example:
 *      {
 *          "id": "FMvFP4M",
 *          "name": "In Progress 2.0",
 *          "order": 5
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
 *          "SERR": "TaskstatusAlreadyExist"
 *      }
 *
 * @apiError    NoCurrentMember             Currently there is no member logged in.
 * @apiError    NotEnoughPermission         Current member has no permission for that action.
 * @apiError    TaskstatusNotExist      A taskstatus with the current requested id doesn't exist.
 * @apiError    TaskstatusAlreadyExist      A taskstatus with this name already exist.
 */
exports.put = function (req, res) {
    var oStatus = new classes.Taskstatus();
    session.loadSessionData(req, res, prohelper.loadMemberSessionData)
        .then(function () {
            return req.oSessiondata.hasPermission("Taskstatus.Change");
        })
        .then(function () {
            return helper.checkRequiredValues([
                ["id", req.body.id]
            ]);
        })
        .then(function () {
            return __dbhandler.fetch("FetchTaskstatusGroupID", [req.oSessiondata.get.idGroup(), req.body.id]);
        })
        .then(function (aData) {
            if (aData.length === 0) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "TaskstatusNotExist"
                };
            }
            oStatus = new classes.Taskstatus(aData[0]);
            return;
        })
        .then(function () {
            if (helper.isset(req.body.name) &&
                req.body.name !== "" &&
                req.body.name !== oStatus.get.sName()) {
                return __dbhandler.fetch("FetchTaskstatusGroupName", [req.oSessiondata.get.idGroup(), req.body.name]);
            }
            return;
        })
        .then(function (aData) {
            if (helper.isset(aData) && aData.length !== 0) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "TaskstatusAlreadyExist"
                };
            }

            if (helper.isset(req.body.name) &&
                req.body.name !== "") {
                oStatus.set.sName(req.body.name);
            }
            if (helper.isset(req.body.order)) {
                oStatus.set.iOrder(req.body.order);
            }
            return __dbhandler.insertOrUpdate(oStatus);
        })
        .then(function () {
            res.json({
                "id": oStatus.get.taskstatusID()
            });
        })
        .catch(function (oErr) {
            prohelper.httpErrorHandler(res, oErr);
        });
};

/**
 * @api {delete} /member/taskstatus Delete Taskstatus
 * @apiVersion  1.0.0
 * @apiName DeleteTaskstatus
 * @apiGroup Taskstatus
 * @apiPermission Member Taskstatus.Delete
 *
 * @apiDescription Load a existing Taskstatus.
 *
 * @apiParam  {String}      id      The id of an existing taskstatus.
 *
 * @apiExample {json} Request Example:
 *      {
 *          "id": "SP0OqZf"
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
 *          "SERR": "TaskstatusNotExist"
 *      }
 *
 * @apiError    NoCurrentMember         Currently there is no member logged in.
 * @apiError    NotEnoughPermission     Current member has no permission for that action.
 * @apiError    TaskstatusNotExist      A taskstatus with the current requested id doesn't exist.
 */
exports.delete = function (req, res) {
    var oStatus = new classes.Taskstatus();
    session.loadSessionData(req, res, prohelper.loadMemberSessionData)
        .then(function () {
            return req.oSessiondata.hasPermission("Taskstatus.Delete");
        })
        .then(function () {
            return helper.checkRequiredValues([
                ["id", req.body.id]
            ]);
        })
        .then(function () {
            return __dbhandler.fetch("FetchTaskstatusGroupID", [req.oSessiondata.get.idGroup(), req.body.id]);
        })
        .then(function (aData) {
            if (aData.length === 0) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "TaskstatusNotExist"
                };
            }
            oStatus = new classes.Taskstatus(aData[0]);
            return __dbhandler.delete(oStatus);
        })
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (oErr) {
            prohelper.httpErrorHandler(res, oErr);
        });
};
