import { Router } from "express";
import { bookingControllers } from "./booking.controller";
import { auth } from "../../middleware/auth";

const router = Router(); 


router.get('/', auth(), bookingControllers.getAllBooking);

router.get('/:id', bookingControllers.getSingleBooking); 





export const bookingRouter = router;