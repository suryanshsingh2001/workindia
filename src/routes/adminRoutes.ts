import { Router } from 'express';
import { addTrain } from '../controllers/adminController';
import { verifyAdmin, verifyRole } from '../middlewares/authMiddleware';

const router = Router();

router.post('/train', verifyRole("admin"), addTrain);

export default router;