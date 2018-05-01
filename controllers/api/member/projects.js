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

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// API
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * @api {get} /member/projects Load Projects
 * @apiVersion  1.0.0
 * @apiName LoadProjects
 * @apiGroup Project
 * @apiPermission Member Project.View
 *
 * @apiDescription Load projects for the current members group.
 *
 * @apiParam  {Number}      [pageitems]         The number of projects per pageload. Default is 10.
 * @apiParam  {Number}      [page]              The page loading count up from 1 - *.
 *
 * @apiExample {json} Request Example:
 *      {
 *          "pageitems": 20,
 *          "page": 2
 *      }
 *
 * @apiExample {json} Response Example:
 *      HTTP/1.1 200 OK
 *      Content-Type: application/json; charset=utf-8
 *      [
 *          {
 *              "id": "MXt7l0T",
 *              "name": "My Next Proj",
 *              "dtSince": 1525094797,
 *              "text": "This is some descripting Text for this project and some more for spezify it",
 *              "intern": true
 *          },{
 *              "id": "9PbTWp8",
 *              "name": "My Oldest Proj",
 *              "dtSince": 1325095165,
 *              "text": "This is some descripting Text for this project wich is very very old.",
 *              "intern": false
 *          },{
 *              "id": "fbz5sgL",
 *              "name": "Myproj",
 *              "dtSince": 1525094741,
 *              "text": "This is some descripting Text for this project",
 *              "intern": false
 *          }
 *      ]
 *
 * @apiExample {json} Error-Response Example:
 *      HTTP/1.1 403 Forbidden
 *      Content-Type: application/json; charset=utf-8
 *      {
 *          "SERR": "NoCurrentMember"
 *      }
 *
 * @apiError    NoCurrentMember         Currently there is no member logged in.
 * @apiError    NotEnoughPermission     Current member has no permission for that action.
 */
exports.get = function (req, res) {
    var oProject = new classes.Project();
    var aProjects = [];
    session.loadSessionData(req, res, prohelper.loadMemberSessionData)
        .then(function () {
            return req.oSessiondata.hasPermission("Project.View");
        })
        .then(function () {
            if (req.query.page) {
                req.query.page = parseInt(req.query.page) - 1;
            }
            if (!helper.isset(req.query.page) || req.query.page < 0) {
                req.query.page = 0;
            }
            if (req.query.pageitems) {
                req.query.pageitems = parseInt(req.query.pageitems);
            }
            if (!helper.isset(req.query.pageitems) || req.query.pageitems < 1) {
                req.query.pageitems = 10;
            }
            return __dbhandler.fetch("FetchProjectGroup", [req.oSessiondata.get.idGroup()], {
                orderby: [{
                    col: "sName",
                    order: "ASC"
                }],
                limit: req.query.pageitems,
                offset: req.query.page * req.query.pageitems
            });
        })
        .then(function (aData) {
            var i = 0;
            while (i < aData.length) {
                oProject = new classes.Project(aData[i]);
                aProjects.push(oProject.toJson());
                i += 1;
            }
            return;
        })
        .then(function () {
            res.json(aProjects);
        })
        .catch(function (oErr) {
            prohelper.httpErrorHandler(res, oErr);
        });
};
