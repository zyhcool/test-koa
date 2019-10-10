import BaseController from "./base.ctrl";
import { BaseContext } from "koa";
import TestService from "../service/test.service";
import redisClient from "../database/redisClient";
import WebsocketClient from "../../websocket";
import FileService from "../service/file.service";
import { IStandardRequest } from "../types/common.type";

export default class FileController extends BaseController<FileService> {
    constructor(service: FileService) {
        super(service);
    }

    async uploadFile(data: IStandardRequest, ws?: WebsocketClient) {
        if (ws && ws instanceof WebsocketClient) {
            console.log("delegate");
            this.service.delegateUploadFile(ws);
            return;
        }
        await this.service.uploadFile(data.file);
        
    }
}
