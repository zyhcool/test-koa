import RedisClient from "../database/redisClient";
import { createHash } from "crypto";
import { IAsyncEventReqData, redisKeys } from "../types/redis.type";
import * as fs from "fs";
import * as path from "path";
import FileUtil from "../util/file.util";
import { IFileData } from "../types/file.type";

export default class Redis {
    private static controller: any;
    static commonConnection: RedisClient;
    static eventLoopConnection: RedisClient;
    static async init(controller: any) {
        this.controller = controller;
        this.commonConnection = new RedisClient();
        this.eventLoopConnection = new RedisClient();
        await this.excAsyncEvent();
    }

    static async excAsyncEvent() {
        const sign = await this.eventLoopConnection.blpop(redisKeys.queue, 0);
        const stringifyData = await this.commonConnection.hget(redisKeys.event, sign);
        if (stringifyData) {
            const request: IAsyncEventReqData = JSON.parse(stringifyData);
            setTimeout(() => {
                const instance = this.controller[request.method];
                instance[request.method](request.data);
            }, 0);

        } else {
            // 若取不到数据，重新加入队列中
            this.commonConnection.rpush(redisKeys.queue, sign);
        }
        return this.excAsyncEvent();
    }

    static async asyncEventQueue(request: IStandardRequest) {
        const { eventName } = request.query;
        const instance = this.controller[eventName];
        if (instance) {
            let data: IAsyncEventReqData = {
                token: request.token,
                method: eventName,
                data: request,
                time: new Date().getTime(),
            }
            const sign = createHash("md5").update(JSON.stringify(data)).digest("hex");
            // 先把数据插入 event 表，再插入 queue 表，
            // 因为 queue 表一有数据就会开始执行队列，此时 event 表没有数据
            await this.commonConnection.hset(redisKeys.event, sign, JSON.stringify(data));
            await this.commonConnection.rpush(redisKeys.queue, sign);
        }
    }

    static async storeFileBinary(key: string, value: string) {
        // await this.commonConnection.append(key, value);
        await this.commonConnection.rpush(key, value);
    }

    static async getFileListLength(key: string) {
        return await this.commonConnection.llen(key);
    }

    static async writeFile(data: IFileData, key: string, name: string) {
        let a = Buffer.alloc(0);
        for (let i = 0; i < data.chunkNum; i++) {
            let value = await this.commonConnection.lpop(key);
            const buffer = Buffer.from(value, "binary");
            a = Buffer.concat([a, buffer]);
        }
        let dir = FileUtil.mkUploadDir();
        const filename = `${new Date().getTime()}${Math.ceil(Math.random() * 1000)}-${name}`
        fs.appendFileSync(path.resolve(dir, filename), a);
    }
}