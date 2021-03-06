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
 * @api {post} /member/project Add Project
 * @apiVersion  1.0.0
 * @apiName AddProject
 * @apiGroup Project
 * @apiPermission Member Project.Add
 *
 * @apiDescription This API adds a new project to the specific group.
 *
 * @apiParam  {String}      name        The name for the new project
 * @apiParam  {String}      [text]      Some descripting additional text for the project.
 * @apiParam  {Boolean}     [intern]    Is this project just intern for the member or can also be shown by contacts.
 *
 * @apiExample {json} Request Example:
 *      {
 *          "name": "Myproj",
 *          "text": "This is some descripting Text for this absolute private project. Only Member can see it.",
 *          "intern": true
 *      }
 *
 * @apiExample {json} Response Example:
 *      HTTP/1.1 200 OK
 *      Content-Type: application/json; charset=utf-8
 *      {
 *          "id": "OZ8zgsa"
 *      }
 *
 * @apiExample {json} Error-Response Example:
 *      HTTP/1.1 400 Bad Request
 *      Content-Type: application/json; charset=utf-8
 *      {
 *          "SERR": "ProjectAlreadyExist"
 *      }
 *
 * @apiError    NoCurrentMember         Currently there is no member logged in.
 * @apiError    NotEnoughPermission     Current member has no permission for that action.
 * @apiError    MissingRequiredValues   Required parameters are not set. See respnse for mission values.
 * @apiError    ProjectAlreadyExist     A project with this name already exist.
 */
exports.post = function (req, res) {
    var oProject = new classes.Project();
    session.loadSessionData(req, res, prohelper.loadMemberSessionData)
        .then(function () {
            return req.oSessiondata.hasPermission("Project.Add");
        })
        .then(function () {
            return helper.checkRequiredValues([
                ["name", req.body.name]
            ]);
        })
        .then(function () {
            return __dbhandler.fetch("FetchProjectGroupName", [req.oSessiondata.get.idGroup(), req.body.name]);
        })
        .then(function (aData) {
            if (aData.length !== 0) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "ProjectAlreadyExist"
                };
            }
            oProject.set.idGroup(req.oSessiondata.get.idGroup());
            oProject.set.sName(req.body.name);
            if (req.body.text) {
                oProject.set.sText(req.body.text);
            }
            if (req.body.intern !== undefined) {
                oProject.set.bIntern(helper.isTrue(req.body.intern, true));
            }
            return __dbhandler.insert(oProject);
        })
        .then(function () {
            res.json({
                "id": oProject.get.projectID()
            });
        })
        .catch(function (oErr) {
            prohelper.httpErrorHandler(res, oErr);
        });
};

/**
 * @api {get} /member/project Load Project
 * @apiVersion  1.0.0
 * @apiName LoadProject
 * @apiGroup Project
 * @apiPermission Member Project.View
 *
 * @apiDescription Load a specific project with every data.
 *
 * @apiParam  {String}      id      The id of the specific project.
 *
 * @apiExample {json} Request Example:
 *      {
 *          "id": "OZ8zgsa"
 *      }
 *
 * @apiExample {json} Response Example:
 *      HTTP/1.1 200 OK
 *      Content-Type: application/json; charset=utf-8
 *      {
 *          "id": "OZ8zgsa",
 *          "name": "Myproj",
 *          "dtSince": 1525094448,
 *          "text": "This is some descripting Text for this project",
 *          "intern": false
 *      }
 *
 * @apiExample {json} Error-Response Example:
 *      HTTP/1.1 400 Bad Request
 *      Content-Type: application/json; charset=utf-8
 *      {
 *          "SERR": "ProjectNotExist"
 *      }
 *
 * @apiError    NoCurrentMember         Currently there is no member logged in.
 * @apiError    NotEnoughPermission     Current member has no permission for that action.
 * @apiError    MissingRequiredValues   Required parameters are not set. See respnse for mission values.
 * @apiError    ProjectNotExist         A project with the current id doesn't exist.
 */
exports.get = function (req, res) {
    var oProject = new classes.Project();
    session.loadSessionData(req, res, prohelper.loadMemberSessionData)
        .then(function () {
            return req.oSessiondata.hasPermission("Project.View");
        })
        .then(function () {
            return helper.checkRequiredValues([
                ["id", req.query.id]
            ]);
        })
        .then(function () {
            return __dbhandler.fetch("FetchProjectGroupID", [req.oSessiondata.get.idGroup(), req.query.id]);
        })
        .then(function (aData) {
            if (aData.length === 0) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "ProjectNotExist"
                };
            }
            oProject = new classes.Project(aData[0]);
            return;
        })
        .then(function () {
            res.json(oProject.toJson());
        })
        .catch(function (oErr) {
            prohelper.httpErrorHandler(res, oErr);
        });
};

/**
 * @api {put} /member/project Change Project
 * @apiVersion  1.0.0
 * @apiName ChangeProject
 * @apiGroup Project
 * @apiPermission Member Project.Change
 *
 * @apiDescription Change a existing project.
 *
 * @apiParam  {String}      id          A id of an existing project
 * @apiParam  {String}      [name]      String to set a new projectname
 * @apiParam  {String}      [text]      A new description for the project.
 * @apiParam  {Boolean}     [intern]    Is the project just for member visible.
 *
 * @apiExample {json} Request Example:
 *      {
 *          "id": "OZ8zgsa",
 *          "name": "Myprojwithnewname",
 *          "text": "This is some descripting Text for this project and i add some more text",
 *          "intern": true
 *      }
 *
 * @apiExample {json} Response Example:
 *      HTTP/1.1 200 OK
 *      Content-Type: application/json; charset=utf-8
 *      {
 *          "id": "OZ8zgsa"
 *      }
 *
 * @apiExample {json} Error-Response Example:
 *      HTTP/1.1 400 Bad Request
 *      Content-Type: application/json; charset=utf-8
 *      {
 *          "SERR": "ProjectNotExist"
 *      }
 *
 * @apiError    NoCurrentMember         Currently there is no member logged in.
 * @apiError    NotEnoughPermission     Current member has no permission for that action.
 * @apiError    MissingRequiredValues   Required parameters are not set. See respnse for mission values.
 * @apiError    ProjectNotExist         A project with the current id doesn't exist.
 * @apiError    ProjectAlreadyExist     A project with this new name already exist (only apears when try to set new name).
 */
exports.put = function (req, res) {
    var oProject = new classes.Project();
    session.loadSessionData(req, res, prohelper.loadMemberSessionData)
        .then(function () {
            return req.oSessiondata.hasPermission("Project.Change");
        })
        .then(function () {
            return helper.checkRequiredValues([
                ["id", req.body.id]
            ]);
        })
        .then(function () {
            return __dbhandler.fetch("FetchProjectGroupID", [req.oSessiondata.get.idGroup(), req.body.id]);
        })
        .then(function (aData) {
            if (aData.length === 0) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "ProjectNotExist"
                };
            }
            oProject = new classes.Project(aData[0]);
            return;
        })
        .then(function () {
            if (helper.isset(req.body.name) &&
                req.body.name !== "" &&
                req.body.name !== oProject.get.sName()) {
                return __dbhandler.fetch("FetchProjectGroupName", [req.oSessiondata.get.idGroup(), req.body.name]);
            }
            return;
        })
        .then(function (aData) {
            if (helper.isset(aData) && aData.length !== 0) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "ProjectAlreadyExist"
                };
            }
            if (helper.isset(req.body.name) &&
                req.body.name !== "") {
                oProject.set.sName(req.body.name);
            }
            if (helper.isset(req.body.text)) {
                oProject.set.sText(req.body.text);
            }
            if (helper.isset(req.body.intern)) {
                oProject.set.bIntern(helper.isTrue(req.body.intern, true));
            }
            return __dbhandler.update(oProject);
        })
        .then(function () {
            res.json({
                "id": oProject.get.projectID()
            });
        })
        .catch(function (oErr) {
            prohelper.httpErrorHandler(res, oErr);
        });
};

/**
 * @api {delete} /member/project Delete Project
 * @apiVersion  1.0.0
 * @apiName DeleteProject
 * @apiGroup Project
 * @apiPermission Member Project.Delete
 *
 * @apiDescription Delete a existing project.
 *
 * @apiParam  {String}      id          A id of an existing project
 *
 * @apiExample {json} Request Example:
 *      {
 *          "id": "OZ8zgsa"
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
 *          "SERR": "ProjectNotExist"
 *      }
 *
 * @apiError    NoCurrentMember         Currently there is no member logged in.
 * @apiError    NotEnoughPermission     Current member has no permission for that action.
 * @apiError    MissingRequiredValues   Required parameters are not set. See respnse for mission values.
 * @apiError    ProjectNotExist         A project with the current id doesn't exist.
 */
exports.delete = function (req, res) {
    var oProject = new classes.Project();
    session.loadSessionData(req, res, prohelper.loadMemberSessionData)
        .then(function () {
            return req.oSessiondata.hasPermission("Project.Delete");
        })
        .then(function () {
            return helper.checkRequiredValues([
                ["id", req.body.id]
            ]);
        })
        .then(function () {
            return __dbhandler.fetch("FetchProjectGroupID", [req.oSessiondata.get.idGroup(), req.body.id]);
        })
        .then(function (aData) {
            if (aData.length === 0) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "ProjectNotExist"
                };
            }
            oProject = new classes.Project(aData[0]);
            return __dbhandler.delete(oProject);
        })
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (oErr) {
            prohelper.httpErrorHandler(res, oErr);
        });
};
