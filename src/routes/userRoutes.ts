import { Router } from 'express';
import { getSeatAvailability, bookSeat, getBookingDetails } from '../controllers/userController';
import { verifyUser } from '../middlewares/authMiddleware';

const router = Router();

router.get('/availability', verifyUser, getSeatAvailability);
router.post('/book', verifyUser, bookSeat);
router.get('/booking/:id', verifyUser, getBookingDetails);

export default router;