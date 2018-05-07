"use strict";
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Dependencies
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var helper = require("../../helper");
var prohelper = require("../../prohelper");
var classes = require("../../classes");
var errorcode = helper.getErrorcodes();

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// API
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * @api {get} /groups Load Group
 * @apiVersion  1.0.0
 * @apiName LoadGroup
 * @apiGroup Permissionless
 * @apiPermission none
 *
 * @apiDescription Load a group by spezific id.
 *
 * @apiParam  {String}      id      The id og a existing group.
 *
 * @apiExample {json} Request Example:
 *      {
 *          "id": "AB7j"
 *      }
 *
 * @apiExample {json} Response Example:
 *      HTTP/1.1 200 OK
 *      Content-Type: application/json; charset=utf-8
 *      {
 *          "id": "1248",
 *          "name": "Absolut-Mygroup"
 *      }
 *
 * @apiExample {json} Error-Response Example:
 *      HTTP/1.1 400 Bad Request
 *      Content-Type: application/json; charset=utf-8
 *      {
 *          "SERR": "GroupNotExist"
 *      }
 *
 * @apiError    MissingRequiredValues   Required parameters are not set. See respnse for mission values.
 * @apiError    GroupNotExist           The requested ID is not a existing group.
 */
exports.get = function (req, res) {
    var oGroup = new classes.Group();
    helper.checkRequiredValues([
            ["id", req.query.id]
        ])
        .then(function () {
            return __dbhandler.fetch("FetchGroupID", [req.query.id]);
        })
        .then(function (aData) {
            if (aData.length === 0) {
                throw {
                    "type": errorcode.ERR_individualError,
                    "SERR": "GroupNotExists"
                };
            }
            oGroup = new classes.Group(aData[0]);
        })
        .then(function () {
            res.json(oGroup.toJson("safe"));
        })
        .catch(function (oErr) {
            prohelper.httpErrorHandler(res, oErr);
        });
};
