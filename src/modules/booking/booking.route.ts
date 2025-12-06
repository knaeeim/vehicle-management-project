import { Router } from "express";
import { bookingControllers } from "./booking.controller";
import { auth } from "../../middleware/auth";

const router = Router(); 


router.get('/', auth(), bookingControllers.getAllBooking);

router.post('/', bookingControllers.createBooking);

router.put('/:bookingId', auth(), bookingControllers.bookingUpdate);

export const bookingRouter = router;