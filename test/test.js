"use strict";
// import "reflect-metadata";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
// const requiredMetaKey = Symbol.for("router:required");
// const validate = function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
//     console.log("validate");
//     let method = descriptor.value
//     descriptor.value = function (...args: any[]) {
//         let rules = Reflect.getMetadata(requiredMetaKey, target, propertyKey);
//         console.log("lll", rules)
//         if (rules && rules.length) {
//             rules.forEach((index) => {
//                 if (!args[index]) {
//                     throw new Error("not valid");
//                 }
//             })
//         }
//         return method.call(this, ...args);
//     }
// }
// const required = function (target: any, propertyKey: string, index: number) {
//     console.log("required");
//     let rules = Reflect.getMetadata(requiredMetaKey, target) || [];
//     // if(!Array.isArray(rules) || rules.indexOf(index)>=0){
//     //     return;
//     // }
//     rules.push(index);
//     Reflect.defineMetadata(requiredMetaKey, rules, target, propertyKey);
// }
// class User {
//     // @meta("name")
//     name: string
//     constructor(name: string) {
//         this.name = name
//     }
//     // 调用装饰器
//     @validate
//     // @meta("chagenname")
//     changeName(@required newName: string) {
//         console.log("changeName");
//         this.name = newName;
//         return "jdkjf";
//     }
// }
// const user = new User("haha");
// // user.changeName("");
// console.log(user);
// function meta(name) {
//     return (target, propertyKey) => {
//         let type = Reflect.getMetadata("design:type", target, propertyKey);
//         console.log(`${name}`, type);
//         let paramstypes = Reflect.getMetadata("design:paramtypes", target, propertyKey);
//         console.log(`${name}`, paramstypes);
//         let returntype = Reflect.getMetadata("design:returntype", target, propertyKey);
//         console.log(`${name}`, returntype);
//     }
// }
require("reflect-metadata");
var C = /** @class */ (function () {
    function C() {
    }
    C.prototype.foo = function (n) {
        return n * 2;
    };
    __decorate([
        __param(0, log)
    ], C.prototype, "foo");
    return C;
}());
function log(target, key, index) {
    console.log(target,key)
    var paramtypes = Reflect.getMetadata("design:paramtypes", target, key);
    if (!paramtypes[index]) {
        console.log("error");
    }
}
new C();