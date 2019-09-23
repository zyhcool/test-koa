export default class Util {
    static promisefy<T = any>(fn, ctx: any = null) {
        return (...args) => {
            return new Promise<T>((resolve, reject) => {
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