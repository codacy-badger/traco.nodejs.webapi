"use strict";
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Dependencies
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var helper = require("../../../helper");
var prohelper = require("../../../prohelper");
var classes = require("../../../classes");
var config = require("../../../static/config.json");
var Session = require("../../../module/session").Session;
var session = new Session(config.session.member);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// API
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * @api {get} /member/notes Load Notes
 * @apiVersion  1.0.0
 * @apiName LoadMemberNotes
 * @apiGroup Membernote
 * @apiPermission Member.Note
 *
 * @apiDescription Load notes for the current member.
 *
 * @apiParam  {Number}      [pageitems]         The number of notes per pageload.
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
 *              "id": "gbIpLfP8KfOi7F3",
 *              "dtCreate": 1524852513,
 *              "text": "I need to note me some very long text... and it can also held some linebreaks like \n or \n\r or just &#060;br&#062;"
 *          },{
 *              "id": "SJF5qemup8AwGHt",
 *              "dtCreate": 1524852375,
 *              "text": "Here are some older notes."
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
    var oNote = new classes.Membernote();
    session.loadSessionData(req, res, prohelper.loadMemberSessionData)
        .then(function () {
            return req.oSessiondata.hasPermission("Note");
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
            return __dbhandler.fetch("FetchMembernoteMember", [req.oSessiondata.get.memberID()], {
                orderby: [{
                    col: "dtCreate",
                    order: "DESC"
                }],
                limit: req.query.pageitems,
                offset: req.query.page * req.query.pageitems
            });
        })
        .then(function (aData) {
            var i = 0;
            var aNotes = [];
            while (i < aData.length) {
                oNote = new classes.Membernote(aData[i]);
                aNotes.push(oNote.toJson());
                i += 1;
            }
            return aNotes;
        })
        .then(function (aNotes) {
            res.json(aNotes);
        })
        .catch(function (oErr) {
            prohelper.httpErrorHandler(res, oErr);
        });
};
