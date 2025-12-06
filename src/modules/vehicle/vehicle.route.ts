import { Router } from "express";
import { vehicleControllers } from "./vehicle.controller";
import { auth } from "../../middleware/auth";

const router = Router(); 

router.get('/', vehicleControllers.getAllVehicles);

router.get('/:id', vehicleControllers.getSingleVehicle);

router.post('/', auth(), vehicleControllers.createVehicle);

router.put('/:id', auth(), vehicleControllers.updateVehicle);

router.delete('/:id', auth(), vehicleControllers.deleteVehicle);

export const vehicleRouter = router;