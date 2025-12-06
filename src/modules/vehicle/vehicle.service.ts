import { pool } from "../../config/db"

const getAllVehicles = async () => {
    const result = await pool.query('SELECT * FROM vehicles');
    return result;
}

const createVehicle = async (data : Record<string, unknown>) => {
    const {vehicle_name, type, registration_number, daily_rent_price } = data;

    const result = await pool.query(`
        INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `, [vehicle_name, type, registration_number, daily_rent_price]);

    return result;
}

const getSingleVehicle = async (id : string) => {
    const result = await pool.query('SELECT * FROM vehicles WHERE id = $1', [id]);
    return result;
}

const updateVehicle = async (id: string , data : Record<string, unknown>) => {
    const { daily_rent_price, availability_status } = data;
    const updateFields : string[] = [];
    const updatedFieldsValue : unknown[] = [] 
    let index : number = 1;

    if(daily_rent_price !== undefined){
        updateFields.push(`daily_rent_price = $${++index}`);
        updatedFieldsValue.push(daily_rent_price)
    }

    if(availability_status !== undefined){
        updateFields.push(`availability_status = $${++index}`);
        updatedFieldsValue.push(availability_status)
    }

    const result = await pool.query(`
        UPDATE vehicles
        SET ${updateFields.join(", ")}
        WHERE id = $1
        RETURNING *`, [id, ...updatedFieldsValue]);
    return result;
}

const deleteVehicle = async (id : string) => {
    const result = await pool.query('DELETE FROM vehicles WHERE id = $1 RETURNING *', [id]);
    return result;
}

export const vehicleServices = {
    getAllVehicles,
    createVehicle,
    getSingleVehicle, 
    updateVehicle,
    deleteVehicle
}