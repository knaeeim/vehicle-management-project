import { defaults } from "pg";
import { pool } from "../../config/db"

const getAllBooking = async () => {
    const result = await pool.query('SELECT * FROM bookings');
    return result;
}

const getSingleBooking = async (id: string) => {
    const result = await pool.query('SELECT * FROM bookings WHERE id = $1', [id]);
    return result;
}

const createBooking = async (data: Record<string, unknown>) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = data;
    
    const getVehicle = await pool.query('SELECT * FROM vehicles WHERE id = $1', [vehicle_id]);

    if(getVehicle.rows.length === 0){
        return ('Vehicle not found');
    }

    if(getVehicle.rows[0].availability_status !== 'available'){
        return ('Vehicle is not available for booking');
    }

    let duration = Math.ceil((new Date(rent_end_date as string).getTime()) - (new Date(rent_start_date as string).getTime())) / (1000 * 3600 * 24);

    console.log(duration);

    const total_price = getVehicle.rows[0].daily_rent_price * duration!;

    const result = await pool.query(`INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, 'active']);

    if (getVehicle.rows.length > 0) {
        await pool.query('UPDATE vehicles SET availability_status = $1 WHERE id = $2', ['booked', vehicle_id]);
    }

    return {result, getVehicle};
}

export const bookingServices = {
    getAllBooking,
    getSingleBooking,
    createBooking,
}