import Redis from "ioredis";

let redis= new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379");

redis.on("connect",()=>console.log("Redis Connected"));
redis.on("error",(e)=>console.error(e));

export default redis;
