
import * as redis from "redis";
import Util from "../util/util";

class RedisClient {
    private connection: redis.RedisClient;
    constructor() {
        this.connection = redis.createClient(6379, "127.0.0.1");
    }
    getConnection(){
        return this.connection;
    }

    async lpush(key: string, item: any) {
        this.connection.lpush(key, item);
        console.log(Util.promisefy(this.connection.lpush));
    }

    exc() {
        this.connection.blpop("time", (err, v) => {
            console.log(v)
            if (typeof v === "function") {
                setTimeout(() => {
                    return (() => {
                        this.exc();
                        v();
                    })()
                }, 0);
            }
        });
    }
}

const redisClient = new RedisClient();
export default redisClient;