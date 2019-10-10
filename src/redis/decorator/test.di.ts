import Redis from "..";

export function findTestRedis<S>() {
    return (target: any, methodName: string, descriptor: PropertyDescriptor) => {
        let oldMethod = descriptor.value;
        descriptor.value = async function (id: string) {
            let test = await Redis.getById(id);
            if (!test) {
                let response: S = await oldMethod.call(this, id);
                console.log("res", response)
                await Redis.storeById(id, JSON.stringify(response));
                return response;
            }
            console.log(test)
            return JSON.parse(test);
        }
    }
}