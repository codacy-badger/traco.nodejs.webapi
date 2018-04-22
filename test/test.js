var logger = require("../module/logger")({
    bConsole: false,
    sColor: "red",

    bFile: true,
    bFiledate: true,
    sFilename: "asd",
    sExtension: "log",
    sPath: ".tmp",
    iSaveDays: 0.5,
    bLogdate: true,
    bLogtyp: true
});

// var i = 0;
// while (i < 1000) {
//     logger.log("this is a wonderful log message", "MESSAGE");
//     logger.log("this is a wonderful log message", "DEBUG");
//     logger.log("this is a wonderful log message", "INFO");
//     logger.log("this is a wonderful log message", "INFORMATION");
//     logger.log("this is a wonderful log message", "WARN");
//     logger.log("this is a wonderful log message", "WARNING");
//     logger.log("this is a wonderful log message", "ERROR");
//     logger.log("this is a wonderful log message", "FAIL");
//     logger.log("this is a wonderful log message", "FAILURE");
//     logger.log("this is a wonderful log message", "LOG");
//     i += 1;
// }

// logger.log("this is a wonderful log message", "DEBUG");

// logger.log("this is a wonderful log message", 0);
// logger.log("this is a wonderful log message", 1);
// logger.log("this is a wonderful log message", 2);
logger.log("this is a wonderful log message", 3);
