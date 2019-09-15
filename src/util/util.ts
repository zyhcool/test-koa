export default class Util {
    static promisefy(fn) {
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
                fn.apply(null, args);
            })
        }
    }
}