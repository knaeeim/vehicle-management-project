import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router(); 

router.post('/signin', authController.signInAndCreateUser);

router.post('/signup', authController.loginAndCreateToken);

export const authRouters = router;