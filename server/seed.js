require("dotenv").config();

const mongoose = require("mongoose");

const connectDB = require("./config/db");

const User = require("./models/User");
const Resource = require("./models/Resource");
const seedDatabase = async () => {
  try {
    await connectDB();

    console.log("Connected to MongoDB");

    // Clear old data
    await User.deleteMany();
    await Resource.deleteMany();

    console.log("Old data deleted");

    // -------------------------
    // Admin
    // -------------------------

    await User.create({
      name: "Admin",
      email: "admin@lnmiit.ac.in",
      role: "admin",
    });

    // -------------------------
    // Students
    // -------------------------

    await User.create({
      name: "Student One",
      email: "student1@lnmiit.ac.in",
      role: "student",
    });

    await User.create({
      name: "Student Two",
      email: "student2@lnmiit.ac.in",
      role: "student",
    });

    // -------------------------
    // Resources
    // -------------------------

    await Resource.insertMany([
      {
        name: "LT-1",
        type: "Lecture Hall",
        location: "Academic Block",
        capacity: 120,
        quantity: 1,
      },
      {
        name: "LT-2",
        type: "Lecture Hall",
        location: "Academic Block",
        capacity: 120,
        quantity: 1,
      },
      {
        name: "SAC",
        type: "SAC",
        location: "Student Activity Center",
        capacity: 200,
        quantity: 1,
      },
      {
        name: "CP-1",
        type: "Computer Lab",
        location: "Academic Block",
        capacity: 100,
        quantity: 1,
      },
      {
        name: "CP-2",
        type: "Computer Lab",
        location: "Academic Block",
        capacity: 20,
        quantity: 1,
      },
      {
        name: "Projector",
        type: "Equipment",
        location: "Store Room",
        capacity: 1,
        quantity: 5,
      },
    ]);

    console.log("Seed completed successfully.");

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDatabase();