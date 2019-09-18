import { BaseService } from "./base.service";
import WebsocketClient from "../../websocket";

export default class TestService extends BaseService {
    constructor(){
        super();
    }
    test(){
        console.log("from test service");
    }

    delegateTest(ws: WebsocketClient){
        ws.onmessage = (e)=>{
            console.log("delegate: ",e.data)
        }
    }

}