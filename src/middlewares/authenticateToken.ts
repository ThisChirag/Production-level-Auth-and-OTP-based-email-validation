import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { TokenPayload } from "../utils /GeneratorLogic";
import prisma from "../utils /prisma";
import { getTokenFromUser_Id } from "../cache";


dotenv.config();

const secretKey = process.env.SECRET_KEY || "testing authentication";

export interface AuthReq extends Request {
    user?: TokenPayload // use user? incase it's not always set
}

const verifyPromise = (token: any, secretKey: any): Promise<TokenPayload> =>{ // by deault jwt.verify doesn't return the type of the decoded data, but as we have extends the Requst by user details, so it threw the error,
    return new Promise((resolve, reject)=>{                                     // coz to avoid any confliction at the time of assigning the value of decoded data to the user;
        jwt.verify(token, secretKey, (err: any, decode: any)=>{
            if(!decode){
                reject(err);
            }
            resolve(decode as TokenPayload);
        })
    })
}

export const authenticateToken = async (req: AuthReq, res: Response, next: NextFunction): Promise<void> => {

    const authToken = req.headers.authorization;

    if(!authToken){
        res.status(401).json({//correct
            msg: "Unauthorized, Token not provided.. Please Create Account or login"
        })
        return;
    }
    const token = authToken && authToken.split(' ')[1];

    try{
        const user = await verifyPromise(token, secretKey);
        const email = user.email;
        // res.locals.user -> we can send the jwt data from this method as well, 
        const activeToken = await getTokenFromUser_Id(user.user_Id);

        const isPresent = await prisma.user.findUnique({
            where: {email},
        })
    
    if(!isPresent){
        res.status(400).json({
            msg: "user not found",
        })
        return;
    }

    if(!activeToken || activeToken !== token){
        res.status(401).json({// correct status code;
            msg: "Token expired, please login again"
        })
        return;
    }
        req.user = user;
        next();
    }
    catch(error){
        next(res.status(401).json({ // 401 not 400
            msg: "Token is invalid, please login",
        })) // it's a better approach, as all the logs will be centralized;
    }
    
}

// => test, rate limiter 

