import { BaseService } from "./base.service";
import WebsocketClient from "../../websocket";
import * as fs from "fs";
import { Const } from "../../constants";
import * as path from "path";
import RedisClient from "../database/redisClient";
import Redis from "../redis";
import { FileStatus, IWsUploadFileQueryData } from "../types/file.type";
import { redisKeys } from "../types/redis.type";
import FileUtil from "../util/file.util";

export default class FileService extends BaseService {
    constructor() {
        super();
    }

    async uploadFile(file: IFile) {
        let name = FileUtil.handleHttpUpload(file);
        return {
            code: 0,
            data: name,
        }
    }

    async delegateUploadFile(ws: WebsocketClient<IWsUploadFileQueryData, any, any>) {
        ws.onmessage = async (e) => {
            let filename = `${ws.queryData.hash}-${ws.queryData.filename}`;
            fs.appendFileSync(path.resolve("./", Const.uploadDir, filename), e.data);
        }
    }
}