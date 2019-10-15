export function sortJson(obj: { [key: string]: any }, sortfunction?: (a: any, b: any) => number) {
    var result = {};
    Object.keys(obj).sort(sortfunction).forEach(function (key) {
        var value = obj[key];
        if (Object.prototype.toString.call(value) === '[object Object]') {
            value = sortJson(value, sortfunction);
        }
        result[key] = value;
    });
    return result;
}