import express from 'express';
import { authenticate } from '../middleware/auth';
import {
  getFees,
  getFeeById,
  createFee,
  updateFee,
  deleteFee,
  markFeePaid,
} from '../controllers/feeController';

const router = express.Router();

router.get('/', authenticate, getFees);
router.get('/:id', authenticate, getFeeById);
router.post('/', authenticate, createFee);
router.put('/:id', authenticate, updateFee);
router.delete('/:id', authenticate, deleteFee);
router.post('/:id/pay', authenticate, markFeePaid);

export default router;
