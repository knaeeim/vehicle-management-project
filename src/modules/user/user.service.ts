import { pool } from "../../config/db"

const getAllUsers = async() => {
    // Implementation to get all users from the database
    const result = await pool.query('SELECT * FROM Users'); 
    return result;
}

const updateUserData = async(id: string, data : Record<string, unknown>, role : string) => {
    const fields = Object.keys(data); 
    
    if(fields.length === 0) return "No data to update"

    const adminAllowedFields = ['name', 'email', 'phone', 'role'];
    const customerAllowedFields = ['name', 'email', 'phone']; 

    const allowedFields = role === 'admin' ? adminAllowedFields : customerAllowedFields;

    const filterFields = fields.filter((field) => allowedFields.includes(field));

    if(filterFields.length === 0) return "No valid fields to update";

    const setClause = filterFields.map((field, index) => `${field} = $${index + 2}`).join(', ');

    console.log({setClause : setClause});

    const values = [id, ...filterFields.map((field) => data[field])]; 

    console.log({values : values});

    const query = `
        UPDATE users
        SET ${setClause}
        WHERE id = $1
        RETURNING *;
    `
    const result = await pool.query(query, values); 
    return result; 
}

const deleteUser = async(id: string) => {
    const isBooking = await pool.query('SELECT * FROM Bookings WHERE customer_id = $1', [id]); 
    const bookingList = isBooking.rows;
    const activeBooking = bookingList.map((booking) => booking.status === 'active');
    
    if(activeBooking.length > 0){
        return 'Cannot delete user with active bookings';
    }
    
    const result = await pool.query('DELETE FROM Users WHERE id = $1 RETURNING *', [id]);
    return result;
}


export const userServices = {
    getAllUsers,
    updateUserData, 
    deleteUser
}