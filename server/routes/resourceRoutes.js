const express = require("express");
const router = express.Router();

const {
    addResource,
  getAllResources,
  deleteResource,
  getResourceById,
  updateResource,
} = require("../controllers/resourceController");

const {
    getResourceBookings
} = require("../controllers/bookingController");

const {
    isAuthenticated,
    isAdmin
} = require("../middlewares/authMiddleware");

router.post("/", isAuthenticated, isAdmin, addResource);

router.get("/", isAuthenticated, getAllResources);

router.get("/:id", isAuthenticated, getResourceById);

router.patch("/:id", isAuthenticated, isAdmin, updateResource);

router.delete("/:id", isAuthenticated, isAdmin, deleteResource);

router.get("/:id/bookings", isAuthenticated, getResourceBookings);



module.exports = router;