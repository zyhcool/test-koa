import RedisClient from "../database/redisClient";
import { createHash } from "crypto";
import { IAsyncEventReqData, redisKeys } from "../types/redis.type";
import { IStandardRequest } from "../types/common.type";
import { Mongoose } from "mongoose";
import { sortJson } from "../util/json.util";

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

    static async getById(id: string): Promise<string> {
        let value = await this.commonConnection.get(id);
        return value;
    }

    static async storeById(id: string, value: string) {
        await this.commonConnection.set(id, value);
    }

    static async initMongooseWithRedis(mongoose: Mongoose) {
        let that = this;
        const exec = mongoose.Query.prototype.exec;

        mongoose.Query.prototype["cache"] = function (customKey: string) {
            this._redisCache = true;
            this._key = customKey;
            return this;
        }

        mongoose.Query.prototype.exec = function () {
            let args = arguments;
            let key = this._key || this.getCacheKey();
            if (!this._redisCache && !this._redisCache) {
                return exec.apply(this, args);
            } else {
                return new Promise((resolve, rejects) => {
                    try {
                        that.commonConnection.get(key).then((value) => {
                            if (value) {
                                resolve(JSON.parse(value));
                            } else {
                                exec
                                    .apply(this, args)
                                    .then(async (results) => {
                                        if (results && results.length > 0) {
                                            let result = await that.commonConnection.set(key, JSON.stringify(results), "ex", 10);
                                            if (result === "OK") {
                                                resolve(results);
                                            }
                                        }
                                    })
                                    .catch((e) => {
                                        rejects(e);
                                    })
                            }
                        });
                    } catch (e) {
                        rejects(e);
                    }
                })

            }
        }

        mongoose.Query.prototype["getCacheKey"] = function () {
            const key = {
                model: this.model.modelName,
                op: this.op,
                skip: this.options.skip,
                limit: this.options.limit,
                sort: this.options.sort,
                _options: this._mongooseOptions,
            };
            let sortedJson = sortJson(key);
            return createHash("md5").update(JSON.stringify(sortedJson)).digest("hex");
        }

        ////////  aggregate
        const aggregate = mongoose.Model.aggregate;
        let hasBeenExtended = false;

        mongoose.Model.aggregate = function () {
            const res = aggregate.apply(this, arguments);
            if (!hasBeenExtended && res.constructor && res.constructor.name === 'Aggregate') {
                extend(res.constructor);
                hasBeenExtended = true;
            }
            return res;
        };

        function extend(Aggregate) {
            const exec = Aggregate.prototype.exec;

            Aggregate.prototype.exec = function () {
                let args = arguments;
                let key = this._key || this.getCacheKey();
                if (!this._redisCache && !this._redisCache) {
                    return exec.apply(this, args);
                } else {
                    return new Promise((resolve, rejects) => {
                        try {
                            that.commonConnection.get(key).then((value) => {
                                if (value) {
                                    resolve(JSON.parse(value));
                                } else {
                                    exec
                                        .apply(this, args)
                                        .then(async (results) => {
                                            let result = await that.commonConnection.set(key, JSON.stringify(results), "ex", 10);
                                            if (result === "OK") {
                                                resolve(results);
                                            }
                                        })
                                        .catch((e) => {
                                            rejects(e);
                                        })
                                }
                            });
                        } catch (e) {
                            rejects(e);
                        }
                    })

                }
            };

            Aggregate.prototype.cache = function (customKey: string = '') {
                this._redisCache = true;
                this._key = customKey;
                return this;
            };

            Aggregate.prototype.getCacheKey = function () {
                let sortedJson = sortJson(this._pipeline);
                return createHash("md5").update(JSON.stringify(sortedJson)).digest("hex");
            };
        }
    }
}
