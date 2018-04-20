var logger = require("../module/logger")({
    bConsole: false,
    sColor: "red",

    bFile: true,
    bFiledate: true,
    sFilename: "asd",
    sExtension: "log",
    sPath: ".tmp",
    iSaveDays: 7,
    bLogdate: true,
    bLogtyp: true
});

// var i = 0;
// while (i < 1000) {
//     logger.log("this is a wonderful log message", "DEBUG");
//     logger.log("this is a wonderful log message", "INFO");
//     logger.log("this is a wonderful log message", "INFORMATION");
//     logger.log("this is a wonderful log message", "WARN");
//     logger.log("this is a wonderful log message", "WARNING");
//     logger.log("this is a wonderful log message", "ERROR");
//     logger.log("this is a wonderful log message", "FAIL");
//     logger.log("this is a wonderful log message", "FAILURE");
//     i += 1;
// }

logger.log("this is a wonderful log message", "DEBUG");
