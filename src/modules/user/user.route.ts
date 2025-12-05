import { Router } from "express";
import { userControllers } from "./user.controller";
import { auth } from "../../middleware/auth";

const router = Router(); 

router.get('/', auth(), userControllers.getAllUsers);

export const userRouters = router;