// import { createClient } from "redis";
// import { NextFunction, Request, Response } from "express";

// // Create and connect the Redis client
// const redisClient = createClient();

// redisClient.on("error", (err) => {
//   console.error("Redis Client Error:", err);
// });

// (async () => {
//   try {
//     await redisClient.connect(); // Ensure Redis connection is established
//     console.log("Connected to Redis");
//   } catch (error) {
//     console.error("Failed to connect to Redis:", error);
//   }
// })();

// export const rateLimiter = (limit: number, windowSeconds: number)  =>{
//     return async (req: Request, res: Response, next: NextFunction): Promise<void> => {//express expects void in return in when handling middlwares;
//         const key = `rate:${req.ip}`;

//         try{
//             const requests = await redisClient.incr(key);

//             if(requests == 1){
//                 await redisClient.expire(key, windowSeconds);
//             }

//             if(requests > limit){
//                 const ttl = await redisClient.ttl(key);
//                 res.status(429).json({
//                     msg: "Tried more than allowed request",
//                     retryAfter: ttl,
//                 });
//                 return;
//             }
//             next();

//         }catch(error){
//             console.log('Rate limiter error: ', error);
//             res.status(500).json({
//                 msg: "Internal Error, try again after sometime",
//             });
//         }
//     };
// };


/*____________________________________________________________________________________________________
import { createClient } from "redis";
import { NextFunction, Request, Response } from "express";

// Create and connect the Redis client
const redisClient = createClient();

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

(async () => {
  try {
    await redisClient.connect();
    console.log("Connected to Redis");
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
  }
})();

export const rateLimiter = (
  limit: number, // Maximum number of requests
  windowSeconds: number // Time window in seconds
) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const key = `rate:${req.ip}`; // Rate-limiting key based on IP address

    try {
      // Increment the number of requests for this IP
      const requests = await redisClient.incr(key);

      if (requests === 1) {
        // Set the TTL (expiration) when the key is first created
        await redisClient.expire(key, windowSeconds);
      }

      if (requests > limit) {
        // If the limit is exceeded, calculate remaining time
        const ttl = await redisClient.ttl(key);
        res.status(429).json({
          msg: "Too many requests. Please try again later.",
          retryAfter: ttl, // Retry after this many seconds
        });
        return;
      }

      // Allow the request to proceed
      next();
    } catch (error) {
      console.error("Rate limiter error:", error);

      // Fallback for unexpected errors
      res.status(500).json({
        msg: "Internal server error. Please try again later.",
      });
    }
  };
};*/

import { createClient } from "redis";
import { Request, Response, NextFunction } from "express";

// Create and connect the Redis client
const redisClient = createClient();

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

(async () => {
  try {
    await redisClient.connect();
    console.log("Connected to Redis");
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
  }
})();

// Generic rate limiter middleware
export const rateLimiter = (
  keyPrefix: string, 
  limit: number, // max. no of request 
  windowSeconds: number // time window in seconds
) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const key = `${keyPrefix}:${req.ip}`; // Key combines prefix and IP for unique rate limiting

    try {

      const requests = await redisClient.incr(key);

      if (requests === 1) {
        // setting the expiration time for the key when it is created
        await redisClient.expire(key, windowSeconds);
      }

      if (requests > limit) {
        // If the limit is exceeded, calculate remaining time
        const ttl = await redisClient.ttl(key);
        res.status(429).json({
          msg: "Too many requests. Please try again later.",
          retryAfter: ttl, // Time in seconds before the limit resets
        });
        return;
      }

      next(); // Allow the request to proceed
    } catch (error) {
      console.error("Rate Limiter Error:", error);
      res.status(500).json({
        msg: "Internal server error. Please try again later.",
      });
    }
  };
};


