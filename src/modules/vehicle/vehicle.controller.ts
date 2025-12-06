import { Request, Response } from "express";
import { vehicleServices } from "./vehicle.service";

const getAllVehicles = async ( req: Request, res: Response) => {
    try {
        const result = await vehicleServices.getAllVehicles();
        res.status(200).json({
            success: true,
            message: "Vehicles retrieved successfully",
            data: result.rows,
        });
    } catch (error : any) {
        res.status(500).json({
            success: false,
            message: error.message,
            errors: error,
        })
    }
}



export const vehicleControllers = {
    getAllVehicles, 
}