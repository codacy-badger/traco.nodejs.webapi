"use strict";
//************************************************
// neue Prototypes
//************************************************
if (Type.prototype.functionName) console.warn("Override existing Type.prototype.functionName!"); // eslint-disable-line
Type.prototype.functionName = function () {

};
