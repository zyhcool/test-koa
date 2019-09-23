export default class WebsocketClient<R = any, S = any> {
    private _connection: any;
    constructor(websocket: any) {
        this._connection = websocket;
    }

    get onmessage() {
        return this._connection.onmessage;
    }
    set onmessage(fn: (e: { data: R, [key: string]: any }) => void) {
        this._connection.onmessage = fn;
    }

    send(data: S) {
        this._connection.send(typeof data === "object" ? JSON.stringify(data) : data);
    }

    get onerror() {
        return this._connection.onerror;
    }
    set onerror(fn) {
        this._connection.onerror = fn;
    }

    get onclose() {
        return this._connection.onclose;
    }
    set onclose(fn) {
        this._connection.onclose = fn;
    }

    get onopen() {
        return this._connection.onopen;
    }
    set onopen(fn) {
        this._connection.onopen = fn;
    }
}
