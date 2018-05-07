"use strict";
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Dependencies
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var helper = require("../../helper");
var prohelper = require("../../prohelper");
var classes = require("../../classes");
var exArray = require("../../module/exNativ/array");
var errorcode = helper.getErrorcodes();

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// API
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * @api {get} /groups Search Groups
 * @apiVersion  1.0.0
 * @apiName SearchGroups
 * @apiGroup Permissionless
 * @apiPermission none
 *
 * @apiDescription Search a group by string and return a Array from possible groups. The maximum number of groups returned is 25.
 *
 * @apiParam  {String}      [name]      The expected groupname or a part of a groupname.
 *
 * @apiExample {json} Request Example:
 *      {
 *          "name": "mygr"
 *      }
 *
 * @apiExample {json} Response Example:
 *      HTTP/1.1 200 OK
 *      Content-Type: application/json; charset=utf-8
 *      [
 *          {
 *              "id": "1248",
 *              "name": "Absolut-Mygroup"
 *          },
 *          {
 *              "id": "ahJ9",
 *              "name": "Mygroup"
 *          },
 *          {
 *              "id": "3La9",
 *              "name": "omygroup"
 *          }
 *      ]
 *
 * @apiExample {json} Error-Response Example:
 *      HTTP/1.1 400 Bad Request
 *      Content-Type: application/json; charset=utf-8
 *      {
 *          "SERR": "QueryStringTooLong"
 *      }
 *
 * @apiError        QueryStringTooLong      The requested name string has a bigger length than 191 (max name length in database).
 */
exports.get = function (req, res) {
    var oGroup = new classes.Group();
    helper.startPromiseChain()
        .then(function () {
            if (!req.query.name) {
                req.query.name = "";
            }
            if (req.query.name.length > 191) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "QueryStringTooLong"
                };
            }
            return __dbhandler.fetch("FetchGroupNameLike", [req.query.name], {
                limit: 25
            });
        })
        .then(function (aData) {
            var aGroups = [];
            var i = 0;
            while (i < aData.length) {
                oGroup = new classes.Group(aData[i]);
                aGroups.push(oGroup.toJson("safe"));
                i += 1;
            }
            exArray.sortBy(aGroups, ["name"]);
            return aGroups;
        })
        .then(function (aGroups) {
            res.json(aGroups);
        })
        .catch(function (oErr) {
            prohelper.httpErrorHandler(res, oErr);
        });
};
