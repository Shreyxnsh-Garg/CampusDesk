const express = require("express");
const router = express.Router();


const {
    createBooking,
    getMyBookings,
    getResourceBookings,
    cancelBooking,
    getAllBookings
} = require("../controllers/bookingController");

const {
  isAuthenticated,
    isAdmin
} = require("../middlewares/authMiddleware");

router.post("/", isAuthenticated, createBooking);
router.get("/me", isAuthenticated, getMyBookings);
router.get("/admin", isAuthenticated, isAdmin, getAllBookings);
router.get("/resources/:id", isAuthenticated, getResourceBookings);
router.patch("/:id/cancel", isAuthenticated, cancelBooking);
module.exports = router;