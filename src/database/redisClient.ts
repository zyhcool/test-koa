
import * as redis from "redis";
import Util from "../util/util";

export default class RedisClient {
    private client: redis.RedisClient;

    constructor() {
        this.client = this.createConnection()
    }
    private createConnection() {
        const client: redis.RedisClient = redis.createClient(6379, "127.0.0.1");
        // auth 
        // ...
        client.on("connect", () => {
            console.log("redis client connect");
        })
        client.on("ready", (err) => {
            if (err) {
                console.log(err.message, err.stacks);
            } else {
                console.log("redis client ready");
            }
        })
        return client;
    }

    async rpush(key: string, item: string) {
        const rpush = Util.promisefy(this.client.rpush, this.client);
        let result = await rpush(key, item);
        return result;
    }

    async hset(key: string, field: string, value: string) {
        const hset = Util.promisefy(this.client.hset, this.client);
        let result = await hset(key, field, value);
        return result;
    }

    async hget(key: string, field: string) {
        const hget = Util.promisefy(this.client.hget, this.client);
        let result = await hget(key, field);
        return result;
    }

    async blpop(key: string, delay: number = 0) {
        const blpop = Util.promisefy(this.client.blpop, this.client);
        let [k, value]: [string, string] = await blpop(key, delay);
        return value;
    }

    async lpop(key: string) {
        const lpop = Util.promisefy(this.client.lpop, this.client);
        let result: string = await lpop(key);
        return result;
    }

    async lset(key: string, index: number, value: string) {
        let exists = await this.exists(key);
        if (!exists) {
            await this.rpush(key, value);
        }
        const lset = Util.promisefy(this.client.lset, this.client);
        let result = await lset(key, index, value);
        return result;
    }

    async llen(key: string) {
        const llen = Util.promisefy<string>(this.client.llen, this.client);
        let result = await llen(key);
        return Number.parseInt(result);
    }

    async exists(key: string) {
        const exists = Util.promisefy<number>(this.client.exists, this.client);
        let result = await exists(key);
        return result ? true : false;
    }

    async append(key: string, value: string) {
        const append = Util.promisefy(this.client.append, this.client);
        let result = await append(key, value);
        return result;
    }

    async get(key: string) {
        const get = Util.promisefy(this.client.get, this.client);
        let result = await get(key);
        return result;
    }



}
