import { Request, Response } from "express";
import { authServices } from "./auth.service";

const signInAndCreateUser = async (req: Request, res: Response) => {
    try {
        const result = await authServices.signInAndCreateUser(req.body);
        const { password, ...rest } = result.rows[0];
        res.status(201).json({
            success : true, 
            message : "User created successfully", 
            data : rest,
        })
    } catch (error : any) {
        res.status(500).json({
            success : false, 
            message : error.message, 
            errors : error
        })
    }
} 

const loginAndCreateToken = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const result = await authServices.loginAndCreateToken(email, password); 
        if(!result){
            res.status(401).json({
                success : false, 
                message : "Invalid email or password", 
            })
            return;
        }

        const {password : userPassword, ...rest} = result.user;

        res.status(200).json({
            success : true,
            message : "Login successful",
            data : {
                token : result.token, 
                user: rest,
            },
        })

    } catch (error : any) {
        res.status(500).json({
            success : false, 
            message : error.message, 
            errors : error
        })
    }
}

export const authController = {
    signInAndCreateUser,
    loginAndCreateToken
}