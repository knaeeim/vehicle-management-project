import { pool } from "../../config/db"

const getAllVehicles = async () => {
    const result = await pool.query('SELECT * FROM vehicles');
    return result;
}



export const vehicleServices = {
    getAllVehicles,
}