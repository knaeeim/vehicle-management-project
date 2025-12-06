import { Request, Response } from "express";
import { bookingServices } from "./booking.service";

const getAllBooking = async (req: Request, res: Response) => {
    try {
        if (req.user?.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Forbidden: Admins only",
            })
        }
        const result = await bookingServices.getAllBooking();
        res.status(200).json({
            success: true,
            message: "Bookings retrieved successfully",
            data: result.rows,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            errors: error,
        })
    }
}

const getSingleBooking = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await bookingServices.getSingleBooking(id as string);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No bookings found for this customer",
            });
        }

        res.status(200).json({
            success: true,
            message: "Bookings retrieved successfully",
            data: result.rows, // Return all bookings, not just result.rows[0].booking
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            errors: error,
        })
    }
}

const createBooking = async (req: Request, res: Response) => {
    try {
        const result = await bookingServices.createBooking(req.body);
        let responsedData: object = {}
        if (typeof result === 'string') {
            return res.status(404).json({
                success: false,
                message: result,
            })
        }
        else {
            const { result: bookingInfo, getVehicle } = result;
            const bookingDate = bookingInfo.rows[0];
            const { vehicle_name, daily_rent_price } = getVehicle.rows[0];
            responsedData = {
                ...bookingDate,
                vehicle: {
                    vehicle_name,
                    daily_rent_price
                }
            }
        }
        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: responsedData,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            errors: error,
        })
    }
}

const bookingUpdate = async (req: Request, res: Response) => {
    try {
        const { bookingId } = req.params;
        const result = await bookingServices.bookingUpdate(bookingId as string, req.user?.role as string);
        if (typeof result === 'string') {
            return res.status(404).json({
                success: false,
                message: result,
            });
        }
        res.status(200).json({
            success: true,
            message: "Booking cancelled successfully",
            data: result
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            errors: error,
        })
    }
}

export const bookingControllers = {
    getAllBooking,
    getSingleBooking,
    createBooking,
    bookingUpdate
} 