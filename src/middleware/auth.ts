import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from "../config";


export const auth = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization;
            if(!authHeader || !authHeader.startsWith('Bearer ')){
                return res.status(401).json({
                    success : false, 
                    message : "Unauthorized"
                })
            }

            const token = authHeader!.split(" ")[1];
            const decode = jwt.verify(token as string, config.secret_key as string);

            console.log({ decode_data: decode });
            req.user = decode as JwtPayload;
            next();

        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message,
                errors: error
            })
        }
    }
}