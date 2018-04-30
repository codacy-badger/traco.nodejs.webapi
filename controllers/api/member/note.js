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
var errorcode = helper.getErrorcodes();

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// API
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * @api {post} /member/note Add Note
 * @apiVersion  1.0.0
 * @apiName AddMemberNote
 * @apiGroup Membernote
 * @apiPermission Member.Note
 *
 * @apiDescription Add a new note for the current member.
 *
 * @apiParam  {String}      text    Text in the note
 *
 * @apiExample {json} Request Example:
 *      {
 *          "text": "I need to note me some very long text... and it can also held some linebreaks like \n or \n\r or just <br>"
 *      }
 *
 * @apiExample Response Example:
 *      HTTP/1.1 200 OK
 *      Content-Type: text/plain; charset=utf-8
 *
 * @apiExample {json} Error-Response Example:
 *      HTTP/1.1 403 Forbidden
 *      Content-Type: application/json; charset=utf-8
 *      {
 *          "SERR": "NotEnoughPermission"
 *      }
 *
 * @apiError    NoCurrentMember         Currently there is no member logged in.
 * @apiError    NotEnoughPermission     Current member has no permission for that action.
 */
exports.post = function (req, res) {
    var oNote = new classes.Membernote();
    session.loadSessionData(req, res, prohelper.loadMemberSessionData)
        .then(function () {
            return req.oSessiondata.hasPermission("Note");
        })
        .then(function () {
            return helper.checkRequiredValues([
                ["text", req.body.text]
            ]);
        })
        .then(function () {
            oNote = new classes.Membernote();
            oNote.set.idMember(req.oSessiondata.get.memberID());
            oNote.set.sText(req.body.text);
            return __dbhandler.insert(oNote);
        })
        .then(function () {
            res.json({
                "id": oNote.get.membernoteID()
            });
        })
        .catch(function (oErr) {
            prohelper.httpErrorHandler(res, oErr);
        });
};

/**
 * @api {get} /member/note Load Note
 * @apiVersion  1.0.0
 * @apiName LoadMemberNote
 * @apiGroup Membernote
 * @apiPermission Member.Note
 *
 * @apiDescription Load a specific note for the current member.
 *
 * @apiParam  {String}      id      The id of the spezific note.
 *
 * @apiExample {json} Request Example:
 *      {
 *          "id": "0N0gTY39busdOzw"
 *      }
 *
 * @apiExample {json} Response Example:
 *      HTTP/1.1 200 OK
 *      Content-Type: application/json; charset=utf-8
 *      {
 *          "id": "0N0gTY39busdOzw",
 *          "dtCreate": 1524852374,
 *          "sText": "I need to note me some very long text... and it can also held some linebreaks like \n or \n\r or just &#060;br&#062;"
 *      }
 *
 * @apiExample {json} Error-Response Example:
 *      HTTP/1.1 400 Bad Request
 *      Content-Type: application/json; charset=utf-8
 *      {
 *          "SERR": "NoMembernoteData"
 *      }
 *
 * @apiError    NoCurrentMember         Currently there is no member logged in.
 * @apiError    NotEnoughPermission     Current member has no permission for that action.
 * @apiError    NoMembernoteData        The id doesn't exist.
 */
exports.get = function (req, res) {
    var oNote = new classes.Membernote();
    session.loadSessionData(req, res, prohelper.loadMemberSessionData)
        .then(function () {
            return req.oSessiondata.hasPermission("Note");
        })
        .then(function () {
            return helper.checkRequiredValues([
                ["id", req.query.id]
            ]);
        })
        .then(function () {
            return __dbhandler.fetch("FetchMembernoteMemberID", [req.oSessiondata.get.memberID(), req.query.id]);
        })
        .then(function (aData) {
            if (aData.length === 0) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "NoMembernoteData"
                };
            }
            oNote = new classes.Membernote(aData[0]);
            res.json(oNote.toJson());
        })
        .catch(function (oErr) {
            prohelper.httpErrorHandler(res, oErr);
        });
};

/**
 * @api {put} /member/note Change Note
 * @apiVersion  1.0.0
 * @apiName ChangeMemberNote
 * @apiGroup Membernote
 * @apiPermission Member.Note
 *
 * @apiDescription Change a specific note for the current member.
 *
 * @apiParam  {String}      id      The id of the spezific note.
 * @apiParam  {String}      text    The old text changed to some new text.
 *
 * @apiExample {json} Request Example:
 *      {
 *          "id": "0N0gTY39busdOzw",
 *          "text": "I need to note me some very long text... and here i change the note."
 *      }
 *
 * @apiExample {json} Response Example:
 *      HTTP/1.1 200 OK
 *      Content-Type: application/json; charset=utf-8
 *
 * @apiExample {json} Error-Response Example:
 *      HTTP/1.1 400 Bad Request
 *      Content-Type: application/json; charset=utf-8
 *      {
 *          "SERR": "NoMembernoteData"
 *      }
 *
 * @apiError    NoCurrentMember         Currently there is no member logged in.
 * @apiError    NotEnoughPermission     Current member has no permission for that action.
 * @apiError    NoMembernoteData        The id doesn't exist.
 */
exports.put = function (req, res) {
    var oNote = new classes.Membernote();
    session.loadSessionData(req, res, prohelper.loadMemberSessionData)
        .then(function () {
            return req.oSessiondata.hasPermission("Note");
        })
        .then(function () {
            return helper.checkRequiredValues([
                ["id", req.body.id],
                ["text", req.body.text]
            ]);
        })
        .then(function () {
            return __dbhandler.fetch("FetchMembernoteMemberID", [req.oSessiondata.get.memberID(), req.body.id]);
        })
        .then(function (aData) {
            if (aData.length === 0) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "NoMembernoteData"
                };
            }
            oNote = new classes.Membernote(aData[0]);
            oNote.set.sText(req.body.text);
            return __dbhandler.insertOrUpdate(oNote);
        })
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (oErr) {
            prohelper.httpErrorHandler(res, oErr);
        });
};

/**
 * @api {delete} /member/note Delete Note
 * @apiVersion  1.0.0
 * @apiName DeleteMemberNote
 * @apiGroup Membernote
 * @apiPermission Member.Note
 *
 * @apiDescription Delete a specific note for the current member.
 *
 * @apiParam  {String}      id      The id of the spezific note.
 *
 * @apiExample {json} Request Example:
 *      {
 *          "id": "0N0gTY39busdOzw",
 *      }
 *
 * @apiExample Response Example:
 *      HTTP/1.1 200 OK
 *      Content-Type: text/plain; charset=utf-8
 *
 * @apiExample {json} Error-Response Example:
 *      HTTP/1.1 400 Bad Request
 *      Content-Type: application/json; charset=utf-8
 *      {
 *          "SERR": "NoMembernoteData"
 *      }
 *
 * @apiError    NoCurrentMember         Currently there is no member logged in.
 * @apiError    NotEnoughPermission     Current member has no permission for that action.
 * @apiError    NoMembernoteData        The id doesn't exist.
 */
exports.delete = function (req, res) {
    var oNote = new classes.Membernote();
    session.loadSessionData(req, res, prohelper.loadMemberSessionData)
        .then(function () {
            return req.oSessiondata.hasPermission("Note");
        })
        .then(function () {
            return helper.checkRequiredValues([
                ["id", req.body.id]
            ]);
        })
        .then(function () {
            return __dbhandler.fetch("FetchMembernoteMemberID", [req.oSessiondata.get.memberID(), req.body.id]);
        })
        .then(function (aData) {
            if (aData.length === 0) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "NoMembernoteData"
                };
            }
            oNote = new classes.Membernote(aData[0]);
            return __dbhandler.delete(oNote);
        })
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (oErr) {
            prohelper.httpErrorHandler(res, oErr);
        });
};
