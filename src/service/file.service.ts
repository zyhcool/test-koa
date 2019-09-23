import { BaseService } from "./base.service";
import WebsocketClient from "../../websocket";

export default class FileService extends BaseService {
    constructor() {
        super();
    }
    async delegateUploadFile(ws: WebsocketClient) {
        ws.onmessage = (e) => {
            console.log(e.data);
        }
    }


}