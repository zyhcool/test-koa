
// var C = (function () {
//     function C() {
//     }
//     C.prototype.foo = function (n) {
//         return n * 2;
//     };
//     Object.defineProperty(C.prototype, "foo",
//         __decorate(
//             [log],
//             C.prototype,
//             "foo",
//             Object.getOwnPropertyDescriptor(C.prototype, "foo")
//         ));
//     return C;
// })();

// var __decorate = this.__decorate || function (decorators, target, key, desc) {
//     if (typeof Reflect === "object" && typeof Reflect.decorate === "function") {
//         return Reflect.decorate(decorators, target, key, desc);
//     }
//     switch (arguments.length) {
//         case 2:
//             return decorators.reduceRight(function (o, d) {
//                 return (d && d(o)) || o;
//             }, target);
//         case 3:
//             return decorators.reduceRight(function (o, d) {
//                 return (d && d(target, key)), void 0;
//             }, void 0);
//         case 4:
//             return decorators.reduceRight(function (o, d) {
//                 return (d && d(target, key, o)) || o;
//             }, desc);
//     }
// };

// var log 


require("reflect-metadata");
// let C = (function () {
    let C = function (name) {
        this.name = name;
    };
    C.prototype.foo = (n) => {
        return n * 2;
    };
    decorator(
        [_param(0, log)],
        C.prototype,
        "foo",
        Object.getOwnPropertyDescriptor(C.prototype,"foo"),
    )
//     return C;
// })()

function decorator(decorators, target, methodName, descriptor) {
    const len = arguments.length;
    if (typeof Reflect === "object" && Reflect.decorate) {
        return Reflect.decorate(decorators, target, methodName, descriptor);
    }
    switch (len) {
        case 2:
            return decorators.reduceRight((o, d) => {
                return (d && d(o)) || o;
            }, target);
        case 3:
            return decorators.reduceRight((o, d) => {
                return (d && d(target, methodName)), void 0;
            }, void 0);
        case 4:
            return decorators.reduceRight((o, d) => {
                return (d && d(target, methodName, o)) || o;
            }, descriptor);
    }
}

function log(target, propertyName, index) {
    let paramtypes = Reflect.getMetadata("design:paramtypes");
    if(!paramtypes[index]){
        console.log("error");
    }
}

function _param(index, deco){
    return function(target, methodName){
        deco(target, methodName, index);
    }
}

console.log((new C()).name)