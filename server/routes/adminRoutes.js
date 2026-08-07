const express = require("express");
const router = express.Router();

const { getDashboardStats } = require("../controllers/adminController");

const {
  isAuthenticated,
  isAdmin,
} = require("../middlewares/authMiddleware");

router.get(
  "/dashboard",
  isAuthenticated,
  isAdmin,
  getDashboardStats
);

module.exports = router;