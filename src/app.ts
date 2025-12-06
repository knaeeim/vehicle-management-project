import express, { Request, Response } from 'express';
import initDB from './config/db';
import { userRouters } from './modules/user/user.route';
import { authRouters } from './modules/auth/auth.route';
import { vehicleRouter } from './modules/vehicle/vehicle.route';
import { bookingRouter } from './modules/booking/booking.route';

const app = express(); 

app.use(express.json()); 

// Initialize Database
initDB();

app.use('/api/v1/users', userRouters);

app.use("/api/v1/auth", authRouters);

app.use("/api/v1/vehicles", vehicleRouter);

app.use('/api/v1/bookings', bookingRouter);


export default app;