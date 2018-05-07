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

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// API
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * @api {get} /member/group Load current Group
 * @apiVersion  1.0.0
 * @apiName LoadCurrentGroup
 * @apiGroup Group
 * @apiPermission Member Group.View
 *
 * @apiDescription Load the group of the current current member.
 *
 * @apiExample {json} Response Example:
 *      HTTP/1.1 200 OK
 *      Content-Type: application/json; charset=utf-8
 *      {
 *          "name": "Mygroup",
 *          "dtSince": 1525443250,
 *          "tasks": 163
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
 * @apiError    GroupNotExist           Current member has a non existing Group. Contact an admin because on THIS request the response shouldn't be that.
 */
exports.get = function (req, res) {
    var oGroup = new classes.Group();
    session.loadSessionData(req, res, prohelper.loadMemberSessionData)
        .then(function () {
            return req.oSessiondata.hasPermission("Group.View");
        })
        .then(function () {
            return __dbhandler.fetch("FetchGroupID", [req.oSessiondata.get.idGroup()]);
        })
        .then(function (aData) {
            if (aData.length === 0) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "GroupNotExist"
                };
            }
            oGroup = new classes.Group(aData[0]);
            return;
        })
        .then(function () {
            res.json(oGroup.toJson("session"));
        })
        .catch(function (oErr) {
            prohelper.httpErrorHandler(res, oErr);
        });
};

/**
 * @api {put} /member/group Change current Group
 * @apiVersion  1.0.0
 * @apiName ChangeCurrentGroup
 * @apiGroup Group
 * @apiPermission Member Group.Change
 *
 * @apiDescription Change the data of the current members group.
 *
 * @apiParam  {String}      [name]      A new name for the group that doesn't already exist.
 *
 * @apiExample {json} Request Example:
 *      {
 *          "name": "New-Groupname"
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
 *          "SERR": "NoCurrentMember"
 *      }
 *
 * @apiError    NoCurrentMember         Currently there is no member logged in.
 * @apiError    NotEnoughPermission     Current member has no permission for that action.
 */
exports.put = function (req, res) {
    var oGroup = new classes.Group();
    session.loadSessionData(req, res, prohelper.loadMemberSessionData)
        .then(function () {
            return req.oSessiondata.hasPermission("Group.Change");
        })
        .then(function () {
            return __dbhandler.fetch("FetchGroupID", [req.oSessiondata.get.idGroup()]);
        })
        .then(function (aData) {
            if (aData.length === 0) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "GroupNotExist"
                };
            }
            oGroup = new classes.Group(aData[0]);
            return;
        })
        .then(function () {
            if (helper.isset(req.body.name) &&
                req.body.name !== "" &&
                req.body.name !== oGroup) {
                return __dbhandler.fetch("FetchGroupName", [req.body.name]);
            }
            return;
        })
        .then(function (aData) {
            if (aData.length !== 0) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "GroupAlreadyExist"
                };
            }
            return;
        })
        .then(function () {
            if (helper.isset(req.body.name)) {
                oGroup.set.sName(req.body.name);
            }
            return __dbhandler.update(oGroup);
        })
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (oErr) {
            prohelper.httpErrorHandler(res, oErr);
        });
};

/**
 * @api {delete} /member/group Disabele current Group
 * @apiVersion  1.0.0
 * @apiName DisableCurrentGroup
 * @apiPermission Member Admin
 *
 * @apiDescription Disable the group of the current logged member.
 *
 * @apiExample {json} Response Example:
 *      HTTP/1.1 200 OK
 *      Content-Type: text/plain; charset=utf-8
 *
 * @apiExample {json} Error-Response Example:
 *      HTTP/1.1 400 Bad Request
 *      Content-Type: application/json; charset=utf-8
 *      {
 *          "SERR": "NotEnoughPermission"
 *      }
 *
 * @apiError    NoCurrentMember         Currently there is no member logged in.
 * @apiError    NotEnoughPermission     Current member has no permission for that action.
 */
exports.delete = function (req, res) {
    var oGroup = new classes.Group();
    session.loadSessionData(req, res, prohelper.loadMemberSessionData)
        .then(function () {
            return res.oSessiondata.hasPermission("Admin");
        })
        .then(function () {
            return __dbhandler.fetch("FetchGroupID", [req.oSessiondata.get.idGroup()]);
        })
        .then(function (aData) {
            if (aData.length === 0) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "GroupNotExist"
                };
            }
            oGroup = new classes.Group(aData);
            return;
        })
        .then(function () {
            oGroup.set.dtDeactivate(helper.currentTimestamp());
            return __dbhandler.update(oGroup);
        })
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (oErr) {
            prohelper.httpErrorHandler(res, oErr);
        });
};
