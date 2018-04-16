"use strict";
//************************************************
// neue Prototypes
//************************************************
if (Object.prototype.compare) console.warn("Override existing Object.prototype.compare!"); // eslint-disable-line
Object.prototype.compare = function (object) { // eslint-disable-line
    if (!object) {
        return false;
    }

    for (propName in this) {
        if (this.hasOwnProperty(propName) !== object.hasOwnProperty(propName)) {
            return false;
        } else if (typeof this[propName] !== typeof object[propName]) {
            return false;
        }
    }

    for (propName in object) {
        if (this.hasOwnProperty(propName) !== object.hasOwnProperty(propName)) {
            return false;
        } else if (typeof this[propName] !== typeof object[propName]) {
            return false;
        }

        if (!this.hasOwnProperty(propName)) {
            continue;
        }

        if (this[propName] instanceof Array && object[propName] instanceof Array) {
            /** REQUIRES Array.compare **/
            if (!this[propName].compare(object[propName])) {
                return false;
            }
        } else if (this[propName] instanceof Object && object[propName] instanceof Object) {
            if (!this[propName].compare(object[propName])) {
                return false;
            }
        } else if (this[propName] !== object[propName]) {
            return false;
        }
    }
    return true;
};

if (Object.prototype.isEmpty) console.warn("Override existing Object.prototype.isEmpty!"); // eslint-disable-line
Object.prototype.isEmpty = function () {
    if (Object.keys(this).length === 0) {
        return true;
    }
    return false;
};
