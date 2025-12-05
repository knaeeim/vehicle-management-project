import { Request, Response } from "express";
import { userServices } from "./user.service";

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const result = await userServices.getAllUsers(); 
        const sanitizedUsers = result.rows.map((user) => {
            const { password, ...rest } = user; 
            return rest;
        })
        res.status(200).json({
            success : true, 
            message : "Users retrieved successfully", 
            data : sanitizedUsers,
        })
    } catch (error : any) {
        res.status(500).json({
            success : false, 
            message : error.message, 
            errors : error,
        })
    }
}

const updateUserData = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; 
        const result = "";
    } catch (error : any) {
        res.status(500).json({
            success : false, 
            message : error.message, 
            errors : error,
        })
    }
}


export const userControllers = {
    getAllUsers,
}