const express = require("express");
const router = express.Router();

const { isAuthenticated } = require("../middlewares/authMiddleware");

router.get("/", isAuthenticated, (req, res) => {

    res.status(200).json({
        success: true,
        message: "Welcome to your profile!",
        user: req.user
    });

});

module.exports = router;