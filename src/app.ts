import express, { Request, Response } from 'express';
import initDB from './config/db';
import { userRouters } from './modules/user/user.route';
import { authRouters } from './modules/auth/auth.route';
import { vehicleRouter } from './modules/vehicle/vehicle.route';

const app = express(); 

app.use(express.json()); 

// Initialize Database
initDB();

app.use('/api/v1/users', userRouters);

app.use("/api/v1/auth", authRouters);

app.use("/api/v1/vehicles", vehicleRouter);


export default app;