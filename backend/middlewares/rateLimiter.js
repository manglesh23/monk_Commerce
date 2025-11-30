import redis from "../utils/redis.js";

const WINDOW_SIZE_IN_SECONDS = 60; // 1 minute
const MAX_REQUESTS = 10; // max 10 reqs per window
 // ---------------------------------------------
  // TOKEN VERIFICATION
  // ---------------------------------------------
export const slidingRateLimiter = async (req, res, next) => {
  const ip = req.ip;
  const key = `sliding-window:${ip}`;
  const now = Date.now();

  // Define window start (current time - window size)
  const windowStart = now - WINDOW_SIZE_IN_SECONDS * 1000;

  //Remove old timestamps (older than 60 sec)
  await redis.zremrangebyscore(key, 0, windowStart); //remove key >=min and <=max

  //Count requests in the current window
  const reqCount = await redis.zcard(key); //Get by Key

  if (reqCount >= MAX_REQUESTS) {
    const ttl = await redis.pttl(key);
    return res.status(429).json({
      status: "error",
      message: `Rate limit exceeded. Try again in ${Math.ceil(ttl / 1000)}s.`,
    });
  }

  //Add current request timestamp
  await redis.zadd(key, now, now);   //Key Score Member

  //Expire the key after the window
  await redis.expire(key, WINDOW_SIZE_IN_SECONDS);

  next();
};
