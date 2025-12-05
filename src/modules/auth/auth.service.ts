import bcrypt from "bcryptjs";
import { pool } from "../../config/db";
import jwt from 'jsonwebtoken';
import config from "../../config";

const signInAndCreateUser = async (payload: Record<string, unknown>) => {
    const { name, email, password, phone, role } = payload;

    const hashedPassword = await bcrypt.hash(password as string, 10); 

    const result = pool.query('INSERT INTO users (name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING *', [name, email, hashedPassword, phone, role]);

    return result; 
}

const loginAndCreateToken = async (email: string, password: string) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]); 
    
    if(result.rows.length === 0) return null;

    const user = result.rows[0]; 

    const isPasswordMatched = await bcrypt.compare(password, user.password); 

    if(!isPasswordMatched) return null

    const secretKey = config.secret_key;
    const token = jwt.sign({ email: user.email, name: user.name, role: user.role}, secretKey as string, {expiresIn: '7d'})

    return {token, user}
}

export const authServices = {
    signInAndCreateUser,
    loginAndCreateToken
}