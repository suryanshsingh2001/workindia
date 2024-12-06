import { Router } from 'express';
import { addTrain } from '../controllers/adminController';
import { verifyAdmin } from '../middlewares/authMiddleware';

const router = Router();

router.post('/train', verifyAdmin, addTrain);

export default router;