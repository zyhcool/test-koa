import { BaseService } from "./base.service";
import WebsocketClient from "../../websocket";
import * as fs from "fs";
import { Const } from "../../constants";
import * as path from "path";
import RedisClient from "../database/redisClient";
import Redis from "../redis";
import { FileStatus, IFileData } from "../types/file.type";
import { redisKeys } from "../types/redis.type";

export default class FileService extends BaseService {
    constructor() {
        super();
    }
    async delegateUploadFile(ws: WebsocketClient<any, any>) {
        ws.onmessage = async (e) => {
            const data: IFileData = JSON.parse(e.data);
            const key = `${redisKeys.file}|${data.hash}`;
            await Redis.storeFileBinary(key, data.file.toString());
            if (data.index === data.chunkNum - 1) {
                 await Redis.writeFile(data,key,data.filename)
            }
        }
    }


}