"use strict"

import "reflect-metadata";

const Injectable = (): ClassDecorator => target => {};

@Injectable()
class C {
    constructor(s:string){

    }
}

function Factory(constructor){
    console.log(Reflect.getMetadata("design:paramtypes",constructor));
}

Factory(Reflect.decorate([Injectable()],C));

async function a(s){
    return s;
}

[1,2].forEach(async (value,index)=>{
    console.log(await a(value))
})

console.log("iii");