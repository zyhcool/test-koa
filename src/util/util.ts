export default class Util {
    static promisefy(fn,ctx: any=null) {
        return (...args) => {
            return new Promise<any>((resolve, reject) => {
                const cb = (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                }
                args.push(cb);
                fn.apply(ctx, args);
            })
        }
    }
}