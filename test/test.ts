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
