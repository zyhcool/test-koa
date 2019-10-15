"use strict";
exports.__esModule = true;
require("reflect-metadata");
var Injectable = function () { return function (target) { }; };
var C = /** @class */ (function () {
    function C(s) {
    }
    return C;
}());
function Factory(constructor) {
    console.log(Reflect.getMetadata("design:paramtypes", constructor));
}
Factory(C);
