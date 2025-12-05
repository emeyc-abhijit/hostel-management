import dotenv from "dotenv";
import { connectDB } from "../config/db";
import User from "../models/User";
import bcrypt from "bcryptjs";

dotenv.config();

const usersSeed = [
  {
    name: "Admin User",
    email: "admin@medhavi.edu",
    password: "password123",
    role: "admin",
  },
  {
    name: "Warden Singh",
    email: "warden@medhavi.edu",
    password: "password123",
    role: "warden",
  },
  {
    name: "Rahul Kumar",
    email: "student@medhavi.edu",
    password: "password123",
    role: "student",
  },
];

async function seedUsers() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI environment variable is not set");
    }
    await connectDB(mongoUri);
    console.log("Connected to MongoDB");

    // Clear existing users (optional - comment out if you want to keep existing users)
    await User.deleteMany({});
    console.log("Cleared existing users");

    // Hash passwords and insert users
    for (const userData of usersSeed) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({
        ...userData,
        password: hashedPassword,
      });
      await user.save();
      console.log(`Created user: ${userData.email} (${userData.role})`);
    }

    console.log("✅ User seeding completed successfully!");
    console.log("\nTest Credentials:");
    console.log("Admin: admin@medhavi.edu / password123");
    console.log("Warden: warden@medhavi.edu / password123");
    console.log("Student: student@medhavi.edu / password123");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding users:", error);
    process.exit(1);
  }
}

seedUsers();
