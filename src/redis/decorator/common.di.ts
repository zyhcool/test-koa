import "reflect-metadata"


class Injector {
    private readonly providerMap: Map<any, any> = new Map();
    private readonly instanceMap: Map<any, any> = new Map();
    public setProvider(key: any, value: any): void {
        if (!this.providerMap.has(key)) this.providerMap.set(key, value);
    }
    public getProvider(key: any): any {
        return this.providerMap.get(key);
    }
    public setInstance(key: any, value: any): void {
        if (!this.instanceMap.has(key)) this.instanceMap.set(key, value);
    }
    public getInstance(key: any): any {
        if (this.instanceMap.has(key)) return this.instanceMap.get(key);
        return null;
    }
    public setValue(key: any, value: any): void {
        if (!this.instanceMap.has(key)) this.instanceMap.set(key, value);
    }
}

const rootInjector = new Injector();

export function Inject(): (_constructor: any, propertyName: string) => any {
    return function (_constructor: any, propertyName: string): any {
        const propertyType: any = Reflect.getMetadata('design:type', _constructor, propertyName);
        console.log(propertyType)
        const injector: Injector = rootInjector;

        let providerInsntance = injector.getInstance(propertyType);
        if (!providerInsntance) {
            let providerClass = injector.getProvider(propertyType);
            providerInsntance = new providerClass();
            injector.setInstance(propertyType, providerInsntance);
        }
        _constructor[propertyName] = providerInsntance;

        return (_constructor as any)[propertyName];
    };
}

export function Injectable(): (_constructor: any) => any {
    return function (_constructor: any): any {
        rootInjector.setProvider(_constructor, _constructor);
        return _constructor;
    };
}




import Redis from "..";

export function rdsFindById<S>() {
    return (target: any, methodName: string, descriptor: PropertyDescriptor) => {
        let oldMethod = descriptor.value;
        descriptor.value = async function (id: string) {
            let value = await Redis.getById(id);
            let response: S;
            if (!value) {
                response = await oldMethod.call(this, id);
                await Redis.storeById(id, JSON.stringify(response));
            } else {
                response = JSON.parse(value);
            }
            return response;
        }
    }
}