import mongoose from "mongoose";
import User from "../models/User.js";
import Student from "../models/Student.js";
import Hostel from "../models/Hostel.js";
import Room from "../models/Room.js";
import { hashPassword } from "../utils/auth.js";
import config from "../config/index.js";

async function seedDatabase() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(config.mongodb.uri);

    console.log("Clearing existing data...");
    await User.deleteMany({});
    await Student.deleteMany({});
    await Hostel.deleteMany({});
    await Room.deleteMany({});

    // Create admin user
    const adminPassword = await hashPassword("admin123");
    const admin = new User({
      name: "Admin User",
      email: "admin@hostel.com",
      password: adminPassword,
      role: "admin",
    });
    await admin.save();
    console.log("✓ Admin user created");

    // Create warden users
    const wardenPassword = await hashPassword("warden123");
    const warden1 = new User({
      name: "Warden Boys Hostel",
      email: "warden.boys@hostel.com",
      password: wardenPassword,
      role: "warden",
      phone: "9876543210",
    });
    const warden2 = new User({
      name: "Warden Girls Hostel",
      email: "warden.girls@hostel.com",
      password: wardenPassword,
      role: "warden",
      phone: "9876543211",
    });
    await warden1.save();
    await warden2.save();
    console.log("✓ Warden users created");

    // Create student users
    const studentPassword = await hashPassword("student123");
    const studentUsers = [];
    for (let i = 0; i < 5; i++) {
      const student = new User({
        name: `Student ${i + 1}`,
        email: `student${i + 1}@hostel.com`,
        password: studentPassword,
        role: "student",
        phone: `9876543${200 + i}`,
      });
      await student.save();
      studentUsers.push(student);
    }
    console.log("✓ Student users created");

    // Create hostels
    const hostel1 = new Hostel({
      name: "Boys Hostel A",
      type: "boys",
      totalRooms: 20,
      capacity: 60,
      currentOccupancy: 0,
      occupiedRooms: 0,
      wardenId: warden1._id,
      address: "Campus Area, Building A",
    });

    const hostel2 = new Hostel({
      name: "Girls Hostel A",
      type: "girls",
      totalRooms: 15,
      capacity: 45,
      currentOccupancy: 0,
      occupiedRooms: 0,
      wardenId: warden2._id,
      address: "Campus Area, Building B",
    });

    await hostel1.save();
    await hostel2.save();
    console.log("✓ Hostels created");

    // Create rooms
    const rooms = [];
    for (let i = 1; i <= 20; i++) {
      const room = new Room({
        hostelId: hostel1._id,
        roomNumber: `A${i}`,
        floor: Math.ceil(i / 10),
        capacity: 3,
        occupied: 0,
        type: "triple",
        status: "available",
        students: [],
      });
      rooms.push(room);
      await room.save();
    }

    for (let i = 1; i <= 15; i++) {
      const room = new Room({
        hostelId: hostel2._id,
        roomNumber: `B${i}`,
        floor: Math.ceil(i / 7),
        capacity: 3,
        occupied: 0,
        type: "triple",
        status: "available",
        students: [],
      });
      await room.save();
    }
    console.log("✓ Rooms created");

    // Create students
    for (let i = 0; i < 5; i++) {
      const student = new Student({
        userId: studentUsers[i]._id,
        name: `Student ${i + 1}`,
        email: `student${i + 1}@hostel.com`,
        phone: `9876543${200 + i}`,
        course: "Computer Science",
        year: (i % 4) + 1,
        rollNumber: `CS${2024 + i}00${i + 1}`,
        admissionDate: new Date("2023-08-01"),
        status: "approved",
        roomId: rooms[i]._id,
        hostelId: hostel1._id,
      });
      await student.save();

      // Add student to room
      await Room.findByIdAndUpdate(rooms[i]._id, {
        $push: { students: student._id },
        occupied: 1,
      });
    }
    console.log("✓ Students created and allocated to rooms");

    console.log("\n✓ Database seeded successfully!");
    console.log("\nTest Credentials:");
    console.log("Admin - Email: admin@hostel.com, Password: admin123");
    console.log("Warden - Email: warden.boys@hostel.com, Password: warden123");
    console.log("Student - Email: student1@hostel.com, Password: student123");

    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seedDatabase();
