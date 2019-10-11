import "reflect-metadata"



type Constructor<T = any> = new (...args: any[]) => T;

const ClassDec = (): ClassDecorator => {
    return (target) => {
        return;
    }
};
const PropertyDec = (): PropertyDecorator => {
    return (target, key) => {
        return;
    }
};
const MethodDec = (): MethodDecorator => {
    return (target, key, desc) => {
        return;
    }
};

class OtherService {
    constructor(){}
    a=0;
}
@ClassDec()
class TestService {
    constructor(public readonly otherService: OtherService) { };
    @PropertyDec()
    public name: string;
    @MethodDec()
    public handle(event: number) {
        console.log(this.otherService.a);
     }
}

const Factory = <T>(target: Constructor<T>): T => {
    // 获取所有注入的服务
    console.log(Reflect.getMetadata('design:paramtypes', target)[0].name);
    console.log(Reflect.getMetadata('design:type', target))
    console.log(Reflect.getMetadata('design:returntype', target));

    console.log(Reflect.getMetadata('design:paramtypes', target.prototype, "handle"));
    console.log(Reflect.getMetadata('design:type', target.prototype, "handle"))
    console.log(Reflect.getMetadata('design:returntype', target.prototype, "handle"));

    console.log(Reflect.getMetadata('design:paramtypes', target.prototype, "name"))
    console.log(Reflect.getMetadata('design:returntype', target.prototype, "name"));
    console.log(Reflect.getMetadata('design:type', target.prototype, "name"))
    return new target();
};

Factory(TestService);

