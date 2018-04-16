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
function fLoadModules(callback) {
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
            if (data[i].match(".js")) {
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
}

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
                if (sFolder.indexOf("web") !== -1) {
                    sRoute = sRoute.replace("web/", "");
                }

                // GET methods
                if (oRoutes[sFolder][sFile].get !== undefined) {
                    router.get("/" + sRoute + sFile, helper.sqlsafe, helper.loadSessionData, oRoutes[sFolder][sFile].get);
                    router.get("/" + sRoute + sFile + "/*", helper.sqlsafe, helper.loadSessionData, oRoutes[sFolder][sFile].get);
                }
                // POST methods
                if (oRoutes[sFolder][sFile].post !== undefined) {
                    router.post("/" + sRoute + sFile, helper.sqlsafe, helper.loadSessionData, oRoutes[sFolder][sFile].post);
                    router.post("/" + sRoute + sFile + "/*", helper.sqlsafe, helper.loadSessionData, oRoutes[sFolder][sFile].post);
                }
                // PUT methods
                if (oRoutes[sFolder][sFile].put !== undefined) {
                    router.put("/" + sRoute + sFile, helper.sqlsafe, helper.loadSessionData, oRoutes[sFolder][sFile].put);
                    router.put("/" + sRoute + sFile + "/*", helper.sqlsafe, helper.loadSessionData, oRoutes[sFolder][sFile].put);
                }
                // DELETE methods
                if (oRoutes[sFolder][sFile].delete !== undefined) {
                    router.delete("/" + sRoute + sFile, helper.sqlsafe, helper.loadSessionData, oRoutes[sFolder][sFile].delete);
                    router.delete("/" + sRoute + sFile + "/*", helper.sqlsafe, helper.loadSessionData, oRoutes[sFolder][sFile].delete);
                }
            });
        });

        // Fall-back for non existing jobs
        router.get("/api/*", prohelper.invalid);
        router.post("/api/*", prohelper.invalid);
        router.put("/api/*", prohelper.invalid);
        router.delete("/api/*", prohelper.invalid);

        // Fall-back for non existing other jobs
        router.get("/*", prohelper.invalid);
        router.post("/*", prohelper.invalid);
        router.put("/*", prohelper.invalid);
        router.delete("/*", prohelper.invalid);
    });
};
