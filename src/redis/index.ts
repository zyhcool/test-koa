import RedisClient from "../database/redisClient";
import { createHash } from "crypto";
import { IAsyncEventReqData, redisKeys } from "../types/redis.type";
import { IStandardRequest } from "../types/common.type";

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
}