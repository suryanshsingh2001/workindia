import { Router } from 'express';
import { getSeatAvailability, bookSeat, getBookingDetails } from '../controllers/userController';
import { verifyRole, verifyUser } from '../middlewares/authMiddleware';

const router = Router();

router.get('/availability', verifyRole("user") , getSeatAvailability);
router.post('/book', verifyRole("user"), bookSeat);
router.get('/booking/:id', verifyRole("user"), getBookingDetails);

export default router;