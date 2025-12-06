import { pool } from "../../config/db"

const getAllBooking = async () => {
    const result = await pool.query('SELECT * FROM bookings');
    return result;
}

const getSingleBooking = async (id: string) => {
    const result = await pool.query('SELECT * FROM bookings WHERE id = $1', [id]);
    return result;
}


export const bookingServices = {
    getAllBooking,
    getSingleBooking,
}