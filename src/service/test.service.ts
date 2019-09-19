import { BaseService } from "./base.service";
import WebsocketClient from "../../websocket";

export default class TestService extends BaseService {
    constructor() {
        super();
    }
    async test() {
        console.log("from test service");
    }

    delegateTest(ws: WebsocketClient) {
        ws.onopen = (e) => {
            console.log("open");
        }
        ws.onerror = (e) => {
            console.log(e.message, e.stacks);
        }
        ws.onclose = (e) => {
            console.log(e);
        }

        ws.onmessage = (e) => {
            console.log("onmessage: ", e.data)
        }
    }

}