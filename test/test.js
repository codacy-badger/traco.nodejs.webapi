var IORedis = require("ioredis");

var test = new IORedis("tmp");

test.set("foo", "bar");

test.get("foo", function (err, res) {
    console.log(res);
});
