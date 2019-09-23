import Redis from "../src/redis";
import RedisClient from "../src/database/redisClient";

let redisclient = new RedisClient();
(async ()=>{
  let a = await redisclient.lpop("file|1569230947128");
  console.log(a)
})();