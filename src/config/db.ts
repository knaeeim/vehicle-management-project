import { Pool } from 'pg';
import config from '.'

export const pool = new Pool({
    connectionString: `${config.connection_string}`
})

const initDB = async () => {
    await pool.query(
        `CREATE TABLE IF NOT EXISTS Users(
            id SERIAL PRIMARY KEY, 
            name VARCHAR(200) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL, 
            password TEXT NOT NULL,
            phone VARCHAR(15) NOT NULL,
            role VARCHAR(50) NOT NULL
        )`
    )


    await pool.query(
        `CREATE TABLE IF NOT EXISTS Vehicles(
            id SERIAL PRIMARY KEY, 
            vehicle_name VARCHAR(200) NOT NULL,
            type VARCHAR(30) NOT NULL,
            registration_number VARCHAR(100) UNIQUE NOT NULL, 
            daily_rent_price INT NOT NULL, 
            availability_status VARCHAR(50) DEFAULT 'available'
        )`
    )

    await pool.query(
        `CREATE TABLE IF NOT EXISTS Bookings(
            id SERIAL PRIMARY KEY, 
            customer_id INT REFERENCES users(id) ON DELETE CASCADE, 
            vehicle_id INT REFERENCES Vehicles(id) ON DELETE CASCADE,
            rent_start_date TIMESTAMP NOT NULL, 
            rent_end_date TIMESTAMP NOT NULL, 
            total_price NUMERIC(10, 2) NOT NULL CHECK (total_price > 0), 
            status VARCHAR(50) NOT NULL
        )`
    )
}

export default initDB; 

