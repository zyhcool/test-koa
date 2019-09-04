import * as redis from "redis";

let redisClient = redis.createClient(6379,"localhost");

redisClient.set("name","zyh");

redisClient.get("name",(err,reply)=>{
    console.log(reply);
});
