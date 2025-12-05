import { pool } from "../../config/db"

const getAllUsers = async() => {
    // Implementation to get all users from the database
    const result = await pool.query('SELECT * FROM Users'); 
    return result;
}

const updateUserData = async(id: string, data : Record<string, unknown>) => {
    const fields = Object.keys(data); 
    if(fields.length === 0) {
        return "No data to update";
    }
    
    const result = await pool.query('UPDATE users SET ... WHERE id = $1 RETURNING *', [id]); 
    return result; 
}


export const userServices = {
    getAllUsers,
}