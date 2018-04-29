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
                orderby: {
                    col: "dtCreate",
                    order: "DESC"
                },
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
