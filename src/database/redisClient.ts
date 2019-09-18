
import * as redis from "redis";
import Util from "../util/util";

class RedisClient {
    private connection: redis.RedisClient;
    private queueConnection: redis.RedisClient;
    constructor() {
        this.connection = redis.createClient(6379, "127.0.0.1");
        this.queueConnection = redis.createClient(6379, "127.0.0.1");
        this.exc();
    }
    async createConnection() {
        return redis.createClient(6379, "127.0.0.1");
    }

    async rpush(key: string, item: any) {
        const rpush = Util.promisefy(this.connection.rpush, this.connection);
        let result = await rpush(key, item);
        return result;
    }

    async hset(key: string, field: string, value: string) {
        const hset = Util.promisefy(this.connection.hset, this.connection);
        let result = await hset(key, field, value);
        return result;
    }

    async hget(key: string, field: string) {
        const hget = Util.promisefy(this.connection.hget, this.connection);
        let result = await hget(key, field);
        return result;
    }

    async blpop(key: string, delay: number) {
        const blpop = Util.promisefy(this.queueConnection.blpop, this.queueConnection);
        let [k, value]: [string, string] = await blpop(key, delay);
        return value;
    }

    async exc() {
        const sign = await this.blpop("queue", 0);
        const dataStringfy = await this.hget("asyncEvent", sign);
        const data = JSON.parse(dataStringfy);
        setTimeout(() => {
            console.log(data,i++)
        }, 0);
        return this.exc();
    }
}
let i=0;
const redisClient = new RedisClient();
export default redisClient;