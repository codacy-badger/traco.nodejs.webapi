var Logger = require("../module/logger").Logger;
var logger = new Logger({
    sPath: "tmp",
    iSaveDays: 1 / 24 / 60
});

for (var i = 0; i < 10; i += 1) {
    logger.log("some shitty and the " + i, 3);
}

console.log(logger.oConfig.iSaveDays * 86400);
