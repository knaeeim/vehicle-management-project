import { pool } from "../../config/db"
import { JwtPayload } from "jsonwebtoken";

const getAllBooking = async (user : JwtPayload) => {
    let result;
    const userData = await pool.query('SELECT * FROM users WHERE email = $1', [user.email]);
    const id = userData.rows[0].id;
    if(user.role === 'admin'){
        result = await pool.query(`
            SELECT 
                b.id, 
                b.customer_id, 
                b.vehicle_id, 
                b.rent_start_date, 
                b.rent_end_date, 
                b.total_price, 
                b.status, 
                json_build_object(
                    'name', u.name,
                    'email', u.email
                ) as customer, 
                json_build_object(
                    'vehicle_name', v.vehicle_name,
                    'registration_number', v.registration_number
                ) as vehicle
            FROM bookings b
            INNER JOIN users u ON b.customer_id = u.id
            INNER JOIN vehicles v ON b.vehicle_id = v.id
            ORDER BY b.id DESC
        `);
    }else{
        result = await pool.query(`
        SELECT 
            b.id, 
            b.customer_id, 
            b.vehicle_id, 
            b.rent_start_date, 
            b.rent_end_date, 
            b.total_price, 
            b.status, 
            json_build_object(
                'vehicle_name', v.vehicle_name,
                'registration_number', v.registration_number,
                'type', v.type
            ) as vehicle
        FROM bookings b
        INNER JOIN users u ON b.customer_id = u.id
        INNER JOIN vehicles v ON b.vehicle_id = v.id
        WHERE b.customer_id = $1
        ORDER BY b.rent_start_date DESC
    `, [id]);
    }

    return result;
}

const createBooking = async (data: Record<string, unknown>) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = data;

    const getVehicle = await pool.query('SELECT * FROM vehicles WHERE id = $1', [vehicle_id]);

    if (getVehicle.rows.length === 0) {
        return ('Vehicle not found');
    }

    if (getVehicle.rows[0].availability_status !== 'available') {
        return ('Vehicle is not available for booking');
    }

    let duration = Math.ceil((new Date(rent_end_date as string).getTime()) - (new Date(rent_start_date as string).getTime())) / (1000 * 3600 * 24);

    console.log(duration);

    const total_price = getVehicle.rows[0].daily_rent_price * duration!;

    const result = await pool.query(`INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, 'active']);

    if (getVehicle.rows.length > 0) {
        await pool.query('UPDATE vehicles SET availability_status = $1 WHERE id = $2', ['booked', vehicle_id]);
    }

    return { result, getVehicle };
}

const bookingUpdate = async (id: string, role: string) => {
    const result = await pool.query('SELECT * FROM bookings WHERE id = $1', [id]);

    // Check if booking exists
    if (result.rows.length === 0) {
        return 'Booking not found';
    }

    const bookingData = result.rows[0];
    const currentDate = new Date();
    const startDate = new Date(bookingData.rent_start_date);
    const endDate = new Date(bookingData.rent_end_date);
    const vehicleData = await pool.query("SELECT * FROM vehicles WHERE id = $1", [bookingData.vehicle_id]);

    const { availability_status } = vehicleData.rows[0];

    if (role === 'admin') {
        // Admin: Mark as "returned" if end date has passed
        if (currentDate > endDate) {
            const status = await pool.query(
                'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *',
                ['returned', id]
            );

            // Update vehicle to available
            await pool.query(
                'UPDATE vehicles SET availability_status = $1 WHERE id = $2',
                ['available', bookingData.vehicle_id]
            );

            return {
                ...status.rows[0], 
                vehicle: {
                    availability_status
                }
            };
        } else {
            return 'Cannot mark as returned before rental end date';
        }
    } else {
        // Customer: Cancel booking ONLY before start date
        if (currentDate < startDate) {
            const status = await pool.query(
                'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *',
                ['cancelled', id]
            );

            // Update vehicle to available
            await pool.query(
                'UPDATE vehicles SET availability_status = $1 WHERE id = $2',
                ['available', bookingData.vehicle_id]
            );

            return status.rows[0];
        } else {
            return 'You cannot cancel the booking after the start date';
        }
    }
}

export const bookingServices = {
    getAllBooking,
    createBooking,
    bookingUpdate
}