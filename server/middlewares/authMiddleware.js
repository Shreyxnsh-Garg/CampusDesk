const jwt = require("jsonwebtoken");

const isAuthenticated = async (req, res, next) => {
  try {

    const authHeader = req.header("Authorization");

if (!authHeader) {
  return res.status(401).json({
    success: false,
    message: "Please login first."
  });
}

const token = authHeader.split(" ")[1];

const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();

  } catch (error) {

    return res.status(401).json({
      success: false,
      message: "Invalid Token."
    });

  }
};

const isAdmin = (req, res, next) => {

    if (req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Access Denied. Admin only."
        });
    }

    next();
};

module.exports = {
    isAuthenticated,
    isAdmin
};