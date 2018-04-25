var Logger = require("../module/logger").Logger;
var logger = new Logger({
    sPath: "tmp"
});

for (var i = 0; i < 10000; i += 1) {
    logger.log("some shitty and the " + i, 3);
}
