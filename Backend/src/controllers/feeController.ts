import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Fee from '../models/Fee';
import Student from '../models/Student';

const ensureAdminOrWarden = (req: Request) => {
  const role = (req as unknown as { userRole?: string }).userRole;
  return role === 'admin' || role === 'warden';
};

export const getFees = async (req: Request, res: Response) => {
  try {
    const fees = await Fee.find().populate('studentId');
    return res.json({ fees });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getFeeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Missing fee id' });
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid fee id' });
    const fee = await Fee.findById(id).populate('studentId');
    if (!fee) return res.status(404).json({ message: 'Fee not found' });
    return res.json({ fee });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const createFee = async (req: Request, res: Response) => {
  if (!ensureAdminOrWarden(req)) return res.status(403).json({ message: 'Forbidden' });
  try {
    const payload = req.body;
    if (!payload.studentId) return res.status(400).json({ message: 'studentId required' });
    if (!mongoose.Types.ObjectId.isValid(payload.studentId)) return res.status(400).json({ message: 'Invalid studentId' });
    const student = await Student.findById(payload.studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    const fee = new Fee({
      studentId: payload.studentId,
      studentName: student.name,
      amount: Number(payload.amount || 0),
      dueDate: payload.dueDate ? new Date(payload.dueDate) : new Date(),
      status: payload.status ?? 'pending',
      type: payload.type ?? 'hostel',
      description: payload.description ?? '',
    });
    await fee.save();
    return res.status(201).json({ fee });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updateFee = async (req: Request, res: Response) => {
  if (!ensureAdminOrWarden(req)) return res.status(403).json({ message: 'Forbidden' });
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Missing fee id' });
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid fee id' });
    const updates = req.body;
    if (updates.studentId && !mongoose.Types.ObjectId.isValid(updates.studentId)) return res.status(400).json({ message: 'Invalid studentId' });
    const fee = await Fee.findByIdAndUpdate(id, {
      ...updates,
      amount: updates.amount ? Number(updates.amount) : undefined,
      dueDate: updates.dueDate ? new Date(updates.dueDate) : undefined,
    }, { new: true });
    if (!fee) return res.status(404).json({ message: 'Fee not found' });
    return res.json({ fee });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const deleteFee = async (req: Request, res: Response) => {
  if (!ensureAdminOrWarden(req)) return res.status(403).json({ message: 'Forbidden' });
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Missing fee id' });
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid fee id' });
    const fee = await Fee.findByIdAndDelete(id);
    if (!fee) return res.status(404).json({ message: 'Fee not found' });
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const markFeePaid = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Missing fee id' });
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid fee id' });
    const fee = await Fee.findById(id);
    if (!fee) return res.status(404).json({ message: 'Fee not found' });
    fee.status = 'paid';
    fee.paidDate = new Date();
    await fee.save();
    return res.json({ fee });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
