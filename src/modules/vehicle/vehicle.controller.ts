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

const createVehicle = async ( req: Request, res: Response) => {
    try {

        console.log(req.user?.role);

        if(req.user?.role !== 'admin'){
            return res.status(403).json({
                success: false,
                message: "Forbidden: Admins only",
            })
        }

        const result = await vehicleServices.createVehicle(req.body); 
        res.status(201).json({
            success: true,
            message: "Vehicle created successfully",
            data: result.rows[0],
        });
    } catch (error : any) {
        res.status(500).json({
            success: false,
            message: error.message,
            errors: error,
        })
    }
}

const getSingleVehicle = async ( req: Request, res: Response) => {
    try {
        const { id } = req.params; 
        const result = await vehicleServices.getSingleVehicle( id as string );
        res.status(200).json({
            success: true,
            message: "Vehicle retrieved successfully",
            data: result.rows[0],
        });
    } catch (error :  any) {
        res.status(500).json({
            success: false,
            message: error.message,
            errors: error,
        })
    }
}

const updateVehicle = async ( req: Request, res: Response) => {
    try {
        if(req.user?.role !== 'admin'){
            return res.status(403).json({
                success: false,
                message: "Forbidden: Admins only",
            })
        }
        const { id } = req.params; 
        const result = await vehicleServices.updateVehicle( id as string, req.body)
        res.status(200).json({
            success: true,
            message: "Vehicle updated successfully",
            data: result.rows[0],
        });
    } catch (error : any) {
        res.status(500).json({
            success: false,
            message: error.message,
            errors: error,
        })
    }
}

const deleteVehicle = async ( req: Request, res: Response) => {
    try {
        if(req.user?.role !== 'admin'){
            return res.status(403).json({
                success: false,
                message: "Forbidden: Admins only",
            })
        }
        const { id } = req.params; 
        const result = await vehicleServices.deleteVehicle( id as string );
        res.status(200).json({
            success: true,
            message: "Vehicle deleted successfully",
            data: null,
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
    createVehicle,
    getSingleVehicle, 
    updateVehicle,
    deleteVehicle
}