export default class WebsocketClient {
    private _connection: any;
    constructor(websocket: any) {
        this._connection = websocket;
    }

    get onmessage(){
        return this._connection.onmessage;
    }
    set onmessage(fn:(e:any)=>void) {
        this._connection.onmessage = fn;
    }

    send(data: any){
        this._connection.send(data);
    }

    get onerror(){
        return this._connection.onerror;
    }
    set onerror(fn){
        this._connection.onerror = fn;
    }

    get onclose(){
        return this._connection.onclose;
    }
    set onclose(fn){
        this._connection.onclose = fn;
    }
}
