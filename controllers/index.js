"use strict";
//************************************************
// Module dependencies
//************************************************
var path = require("path");
var helper = require("../helper");
var prohelper = require("../prohelper");

//************************************************
// Functions
//************************************************
var fLoadModules = function (callback) {
    var oRoutes = {};
    var sPath = "";
    var sFile = "";
    var sDir = "";
    var sMaindir = path.join(__dirname);
    helper.filewalker(sMaindir, function (err, data) {
        if (err) {
            throw err;
        }

        var i = 0;
        while (i < data.length) {
            if (data[i].indexOf(".js") !== -1) {
                sPath = data[i].replace(sMaindir, "");
                sPath = sPath.replace(".js", "");
                sPath = sPath.replace(/\\/g, "/");
                if (sPath.indexOf("/", 3) !== -1) {
                    sDir = sPath.substring(1, sPath.lastIndexOf("/"));
                    sFile = sPath.substring(sPath.lastIndexOf("/") + 1, sPath.length);
                    if (sFile.indexOf("__template") === -1) {
                        oRoutes[sDir] = oRoutes[sDir] || {};
                        oRoutes[sDir][sFile] = require(path.join(sMaindir, sDir, sFile));
                    }
                }
            }
            i += 1;
        }
        callback(oRoutes);
    });
};

//************************************************
// Routes
//************************************************
module.exports = function (router) {
    // Modules
    var sRoute = "";
    fLoadModules(function (oRoutes) {
        Object.keys(oRoutes).forEach(function (sFolder) {
            Object.keys(oRoutes[sFolder]).forEach(function (sFile) {
                sRoute = sFolder + "/";

                // GET methods
                if (oRoutes[sFolder][sFile].get !== undefined) {
                    router.get("/" + sRoute + sFile, helper.sqlsafe, oRoutes[sFolder][sFile].get);
                    router.get("/" + sRoute + sFile + "/*", helper.sqlsafe, oRoutes[sFolder][sFile].get);
                }
                // POST methods
                if (oRoutes[sFolder][sFile].post !== undefined) {
                    router.post("/" + sRoute + sFile, helper.sqlsafe, oRoutes[sFolder][sFile].post);
                    router.post("/" + sRoute + sFile + "/*", helper.sqlsafe, oRoutes[sFolder][sFile].post);
                }
                // PUT methods
                if (oRoutes[sFolder][sFile].put !== undefined) {
                    router.put("/" + sRoute + sFile, helper.sqlsafe, oRoutes[sFolder][sFile].put);
                    router.put("/" + sRoute + sFile + "/*", helper.sqlsafe, oRoutes[sFolder][sFile].put);
                }
                // DELETE methods
                if (oRoutes[sFolder][sFile].delete !== undefined) {
                    router.delete("/" + sRoute + sFile, helper.sqlsafe, oRoutes[sFolder][sFile].delete);
                    router.delete("/" + sRoute + sFile + "/*", helper.sqlsafe, oRoutes[sFolder][sFile].delete);
                }
            });
        });

        // Fall-back for non existing other jobs
        router.get("/*", prohelper.invalid);
        router.post("/*", prohelper.invalid);
        router.put("/*", prohelper.invalid);
        router.delete("/*", prohelper.invalid);
    });
};
