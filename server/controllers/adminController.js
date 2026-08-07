const Resource = require("../models/Resource");
const Booking = require("../models/Booking");
const User = require("../models/User");

exports.getDashboardStats = async (req, res) => {
  try {
    const totalResources = await Resource.countDocuments();

    const totalBookings = await Booking.countDocuments();

    const totalStudents = await User.countDocuments({
      role: "student",
    });

    const pendingReturns = await Booking.countDocuments({
      status: "Confirmed",
    });

    res.status(200).json({
      totalResources,
      totalBookings,
      totalStudents,
      pendingReturns,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};