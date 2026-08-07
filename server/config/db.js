const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed");
    console.error(error.message);

    // Don't kill the server during development
    console.log("⚠️ Server is still running. Check your MongoDB connection.");
  }
};

module.exports = connectDB;