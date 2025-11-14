import { Router } from 'express';
import {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  assignStudentToRoom,
  removeStudentFromRoom,
} from '../controllers/roomController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getRooms);
router.get('/:id', authenticate, getRoomById);
router.post('/', authenticate, createRoom);
router.put('/:id', authenticate, updateRoom);
router.delete('/:id', authenticate, deleteRoom);
router.post('/:id/assign', authenticate, assignStudentToRoom);
router.delete('/:id/students/:studentId', authenticate, removeStudentFromRoom);

export default router;
