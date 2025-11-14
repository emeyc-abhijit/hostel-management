import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Room from '../models/Room';
import Student from '../models/Student';

// helper: set room status from occupancy unless room is under maintenance or reserved
const setStatusFromOccupancy = (room: Record<string, unknown> | null | undefined) => {
  // preserve maintenance/reserved status
  if (!room) return;
  const status = (room as Record<string, unknown>).status as unknown as string | undefined;
  if (status === 'maintenance' || status === 'reserved') return;
  const occupied = Number(((room as Record<string, unknown>).occupied as unknown) ?? 0);
  const capacity = Number(((room as Record<string, unknown>).capacity as unknown) ?? 0);
  (room as Record<string, unknown>)['status'] = occupied >= capacity ? 'occupied' : 'available';
};

const ensureAdminOrWarden = (req: Request) => {
  const role = (req as unknown as { userRole?: string }).userRole;
  return role === 'admin' || role === 'warden';
};

export const getRooms = async (req: Request, res: Response) => {
  try {
    const rooms = await Room.find().populate('students');
    // ensure status reflects occupancy for each room
    for (const r of rooms) {
      const roomRec = r as unknown as Record<string, unknown> & { save?: () => Promise<void> };
      const before = String(roomRec.status ?? '');
      setStatusFromOccupancy(roomRec);
      const after = String(roomRec.status ?? '');
      if (after !== before && typeof roomRec.save === 'function') {
        try { await roomRec.save(); } catch (err) { console.error('Failed to save room status update', err); }
      }
    }
    return res.json({ rooms });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getRoomById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Missing room id parameter' });
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid room id' });
    const room = await Room.findById(id).populate('students');
    if (!room) return res.status(404).json({ message: 'Room not found' });
    // ensure status reflects occupancy
    const roomRec = room as unknown as Record<string, unknown> & { save?: () => Promise<void> };
    const before = String(roomRec.status ?? '');
    setStatusFromOccupancy(roomRec);
    const after = String(roomRec.status ?? '');
    if (after !== before && typeof roomRec.save === 'function') {
      try { await roomRec.save(); } catch (err) { console.error('Failed to save room status update', err); }
    }
    return res.json({ room });
  } catch (err) {
    console.error(err);
  // handle mongoose CastError explicitly
  if ((err as unknown as { name?: string })?.name === 'CastError') return res.status(400).json({ message: 'Invalid room id format' });
    return res.status(500).json({ message: 'Server error' });
  }
};

export const createRoom = async (req: Request, res: Response) => {
  if (!ensureAdminOrWarden(req)) return res.status(403).json({ message: 'Forbidden' });
  try {
    const payload = req.body;
  const room = new Room({ ...payload, occupied: (payload.students || []).length });
  setStatusFromOccupancy(room as unknown as Record<string, unknown>);
  await room.save();
    // If students provided, update their roomNumber
    if (payload.students && Array.isArray(payload.students)) {
      await Student.updateMany(
        { _id: { $in: payload.students } },
        { $set: { roomNumber: room.number } }
      );
    }
    return res.status(201).json({ room });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updateRoom = async (req: Request, res: Response) => {
  if (!ensureAdminOrWarden(req)) return res.status(403).json({ message: 'Forbidden' });
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Missing room id parameter' });
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid room id' });
    const updates = req.body;
  const room = await Room.findByIdAndUpdate(id, updates, { new: true }).populate('students');
  if (!room) return res.status(404).json({ message: 'Room not found' });
  // ensure status reflects occupancy when capacity/occupied changed
  setStatusFromOccupancy(room as unknown as Record<string, unknown>);
  await room.save();
  return res.json({ room });
  } catch (err) {
    console.error(err);
  if ((err as unknown as { name?: string })?.name === 'CastError') return res.status(400).json({ message: 'Invalid room id format' });
    return res.status(500).json({ message: 'Server error' });
  }
};

export const deleteRoom = async (req: Request, res: Response) => {
  if (!ensureAdminOrWarden(req)) return res.status(403).json({ message: 'Forbidden' });
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Missing room id parameter' });
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid room id' });
    const room = await Room.findById(id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    // clear students roomNumber
    if (room.students && room.students.length) {
      await Student.updateMany({ _id: { $in: room.students } }, { $unset: { roomNumber: '' } });
    }
    await Room.findByIdAndDelete(id);
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
  if ((err as unknown as { name?: string })?.name === 'CastError') return res.status(400).json({ message: 'Invalid room id format' });
    return res.status(500).json({ message: 'Server error' });
  }
};

export const assignStudentToRoom = async (req: Request, res: Response) => {
  if (!ensureAdminOrWarden(req)) return res.status(403).json({ message: 'Forbidden' });
  try {
    const { id } = req.params; // room id
    const { studentId } = req.body;
    if (!id) return res.status(400).json({ message: 'Missing room id parameter' });
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid room id' });
    if (!studentId) return res.status(400).json({ message: 'Missing studentId in body' });
    if (!mongoose.Types.ObjectId.isValid(studentId)) return res.status(400).json({ message: 'Invalid student id' });
    const room = await Room.findById(id);
    const student = await Student.findById(studentId);
    if (!room || !student) return res.status(404).json({ message: 'Room or Student not found' });
    if (room.students?.includes(student._id)) return res.status(400).json({ message: 'Student already assigned' });
    if (room.occupied >= room.capacity) return res.status(400).json({ message: 'Room is full' });

  room.students = [...(room.students || []), student._id];
  room.occupied = (room.occupied || 0) + 1;
  setStatusFromOccupancy(room as unknown as Record<string, unknown>);
  await room.save();
    student.roomNumber = room.number;
    await student.save();
    const populated = await room.populate('students');
    return res.json({ room: populated, student });
  } catch (err) {
    console.error(err);
  if ((err as unknown as { name?: string })?.name === 'CastError') return res.status(400).json({ message: 'Invalid id format' });
    return res.status(500).json({ message: 'Server error' });
  }
};

export const removeStudentFromRoom = async (req: Request, res: Response) => {
  if (!ensureAdminOrWarden(req)) return res.status(403).json({ message: 'Forbidden' });
  try {
    const { id, studentId } = req.params;
    if (!id) return res.status(400).json({ message: 'Missing room id parameter' });
    if (!studentId) return res.status(400).json({ message: 'Missing student id parameter' });
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid room id' });
    if (!mongoose.Types.ObjectId.isValid(studentId)) return res.status(400).json({ message: 'Invalid student id' });
    const room = await Room.findById(id);
    const student = await Student.findById(studentId);
    if (!room || !student) return res.status(404).json({ message: 'Room or Student not found' });

  room.students = (room.students || []).filter((s: unknown) => String(s) !== studentId);
  room.occupied = Math.max(0, (room.occupied || 0) - 1);
  setStatusFromOccupancy(room as unknown as Record<string, unknown>);
  await room.save();
    student.roomNumber = undefined;
    await student.save();
    const populated = await room.populate('students');
    return res.json({ room: populated, student });
  } catch (err) {
    console.error(err);
  if ((err as unknown as { name?: string })?.name === 'CastError') return res.status(400).json({ message: 'Invalid id format' });
    return res.status(500).json({ message: 'Server error' });
  }
};
