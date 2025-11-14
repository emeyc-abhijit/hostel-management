import dotenv from 'dotenv';
import { connectDB } from '../config/db';
import Student from '../models/Student';
import Room from '../models/Room';

dotenv.config();

const studentsSeed = [
  {
    name: 'Rahul Kumar',
    email: 'rahul.kumar@medhavi.edu',
    phone: '+91 9876543210',
    enrollmentNumber: 'MSU2024001',
    course: 'B.Tech Computer Science',
    year: 2,
    guardianName: 'Mr. Rajesh Kumar',
    guardianPhone: '+91 9876543211',
    address: '123 MG Road, New Delhi, Delhi 110001',
  },
  {
    name: 'Priya Sharma',
    email: 'priya.sharma@medhavi.edu',
    phone: '+91 9876543212',
    enrollmentNumber: 'MSU2024002',
    course: 'BBA',
    year: 1,
    guardianName: 'Mr. Amit Sharma',
    guardianPhone: '+91 9876543213',
    address: '456 Marine Drive, Mumbai, Maharashtra 400020',
  },
  {
    name: 'Amit Patel',
    email: 'amit.patel@medhavi.edu',
    phone: '+91 9876543214',
    enrollmentNumber: 'MSU2024003',
    course: 'B.Sc Physics',
    year: 3,
    guardianName: 'Mr. Suresh Patel',
    guardianPhone: '+91 9876543215',
    address: '789 Relief Road, Ahmedabad, Gujarat 380001',
  },
  {
    name: 'Sneha Reddy',
    email: 'sneha.reddy@medhavi.edu',
    phone: '+91 9876543216',
    enrollmentNumber: 'MSU2024004',
    course: 'B.Tech Mechanical',
    year: 2,
    guardianName: 'Mr. Krishna Reddy',
    guardianPhone: '+91 9876543217',
    address: '321 Jubilee Hills, Hyderabad, Telangana 500033',
  },
  {
    name: 'Arjun Singh',
    email: 'arjun.singh@medhavi.edu',
    phone: '+91 9876543218',
    enrollmentNumber: 'MSU2024005',
    course: 'MBA',
    year: 1,
    guardianName: 'Mrs. Lakshmi Singh',
    guardianPhone: '+91 9876543219',
    address: '654 Park Street, Kolkata, West Bengal 700016',
  },
  {
    name: 'Anjali Verma',
    email: 'anjali.verma@medhavi.edu',
    phone: '+91 9876543220',
    enrollmentNumber: 'MSU2024006',
    course: 'B.Com',
    year: 2,
    guardianName: 'Mr. Ravi Verma',
    guardianPhone: '+91 9876543221',
    address: '987 Civil Lines, Jaipur, Rajasthan 302006',
  },
  {
    name: 'Karthik Krishnan',
    email: 'karthik.krishnan@medhavi.edu',
    phone: '+91 9876543222',
    enrollmentNumber: 'MSU2024007',
    course: 'B.Tech Electronics',
    year: 3,
    guardianName: 'Mr. Krishnan Iyer',
    guardianPhone: '+91 9876543223',
    address: '234 Anna Nagar, Chennai, Tamil Nadu 600040',
  },
  {
    name: 'Meera Nair',
    email: 'meera.nair@medhavi.edu',
    phone: '+91 9876543224',
    enrollmentNumber: 'MSU2024008',
    course: 'B.Sc Chemistry',
    year: 1,
    guardianName: 'Dr. Suresh Nair',
    guardianPhone: '+91 9876543225',
    address: '567 MG Road, Kochi, Kerala 682011',
  },
  {
    name: 'Abhijit Kirtunia',
    email: 'abhijit.kirtunia@medhavi.edu',
    phone: '+91 9876543226',
    enrollmentNumber: 'MSU2024009',
    course: 'B.Sc Chemistry',
    year: 1,
    guardianName: 'Dr. Suresh Nair',
    guardianPhone: '+91 9876543225',
    address: '567 MG Road, Kochi, Kerala 682011',
  },
];

const roomsSeed = [
  { number: 'A-101', floor: 1, capacity: 2, type: 'double', status: 'occupied', hostel: 'Block A' },
  { number: 'A-102', floor: 1, capacity: 2, type: 'double', status: 'available', hostel: 'Block A' },
  { number: 'A-103', floor: 1, capacity: 2, type: 'double', status: 'maintenance', hostel: 'Block A' },
  { number: 'A-104', floor: 1, capacity: 1, type: 'single', status: 'available', hostel: 'Block A' },
  { number: 'A-204', floor: 2, capacity: 2, type: 'double', status: 'occupied', hostel: 'Block A' },
  { number: 'A-205', floor: 2, capacity: 2, type: 'double', status: 'available', hostel: 'Block A' },
  { number: 'A-305', floor: 3, capacity: 3, type: 'triple', status: 'occupied', hostel: 'Block A' },
  { number: 'B-105', floor: 1, capacity: 2, type: 'double', status: 'occupied', hostel: 'Block B' },
  { number: 'B-106', floor: 1, capacity: 2, type: 'double', status: 'reserved', hostel: 'Block B' },
  { number: 'B-204', floor: 2, capacity: 3, type: 'triple', status: 'occupied', hostel: 'Block B' },
  { number: 'B-305', floor: 3, capacity: 2, type: 'double', status: 'occupied', hostel: 'Block B' },
  { number: 'B-306', floor: 3, capacity: 4, type: 'quad', status: 'available', hostel: 'Block B' },
];

async function seed() {
  const mongo = process.env.MONGO_URI || 'mongodb://localhost:27017/medhavi';
  await connectDB(mongo);

  console.log('Clearing students and rooms collections...');
  await Student.deleteMany({});
  await Room.deleteMany({});

  console.log('Inserting students...');
  const createdStudents = await Student.insertMany(studentsSeed);

  // assign some students to rooms to match the frontend mock layout
  // A-101 -> Arjun (index 4)
  // A-204 -> Rahul (0) + Karthik (6)
  // A-305 -> Amit (2)
  // B-105 -> Priya (1) + Meera (7)
  // B-204 -> Sneha (3)
  // B-305 -> Anjali (5)

  const lookupByEmail: Record<string, { _id: string }> = {};
  for (const s of createdStudents) {
    const idStr = (s as { _id: { toString(): string } })._id.toString();
    lookupByEmail[s.email] = { _id: idStr };
  }

  const mapRoomStudents: Record<string, string[]> = {
    'A-101': [lookupByEmail['arjun.singh@medhavi.edu']._id],
    'A-204': [lookupByEmail['rahul.kumar@medhavi.edu']._id, lookupByEmail['karthik.krishnan@medhavi.edu']._id],
    'A-305': [lookupByEmail['amit.patel@medhavi.edu']._id],
    'B-105': [lookupByEmail['priya.sharma@medhavi.edu']._id, lookupByEmail['meera.nair@medhavi.edu']._id],
    'B-204': [lookupByEmail['sneha.reddy@medhavi.edu']._id],
    'B-305': [lookupByEmail['anjali.verma@medhavi.edu']._id],
  };

  console.log('Inserting rooms and wiring students...');
  for (const r of roomsSeed) {
    const roomStudents = mapRoomStudents[r.number] || [];
    const roomDoc = new Room({ ...r, occupied: roomStudents.length, students: roomStudents });
    await roomDoc.save();
    // update students roomNumber
    if (roomStudents.length) {
      await Student.updateMany({ _id: { $in: roomStudents } }, { $set: { roomNumber: r.number } });
    }
  }

  console.log('Seeding complete.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed', err);
  process.exit(1);
});
