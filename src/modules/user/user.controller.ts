import { Request, Response } from "express";
import { userServices } from "./user.service";

const getAllUsers = async (req: Request, res: Response) => {
    try {

        if (req.user?.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Forbidden: Admins only",
            })
        }

        const result = await userServices.getAllUsers();
        const sanitizedUsers = result.rows.map((user) => {
            const { password, ...rest } = user;
            return rest;
        })
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: sanitizedUsers,
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            errors: error,
        })
    }
}

const updateUserData = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await userServices.updateUserData(id as string, req.body, req.user?.role);
        if (typeof result === 'string') {
            res.status(200).json({
                success: true,
                message: "Technical Error!!, Go and Check error",
                data: result,
            })
        }
        else {
            const { password, ...rest } = result.rows[0];
            res.status(200).json({
                success: true,
                message: "User updated successfully",
                data: rest,
            })
        }
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            errors: error,
        })
    }
}


export const userControllers = {
    getAllUsers,
    updateUserData
}