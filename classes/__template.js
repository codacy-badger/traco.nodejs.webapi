"use strict";
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Dependencies
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// DATABASE CLASSES
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
exports.class = function (fields) {
    // Class properties
    this.classname = "";

    // Class Primary Keys
    this.keys = 1;

    // Database fields
    this.fields = fields || {
        "ID": "  "
    };

    let that = this;
    // Getter und Setter
    this.get = {
        ID: function () {
            return that.fields;
        }
    };

    this.set = {
        ID: function (name) {
            that.fields = name;
        }
    };

    // Functions

};
