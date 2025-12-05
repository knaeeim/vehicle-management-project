import { Router } from "express";
import { userControllers } from "./user.controller";
import { auth } from "../../middleware/auth";

const router = Router(); 

router.get('/', auth(), userControllers.getAllUsers);

router.put('/:id', auth(), userControllers.updateUserData);

export const userRouters = router;