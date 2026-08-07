const transporter = require("../config/mail");
const User = require("../models/User");

const signup = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    // Check required fields
    if (!name || !email || !role) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields"
      });
    }

    // Check duplicate email
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please Login."
      });
    }

    // Create user
    const user = await User.create({
        name,
        email,
        role
    });

    res.status(201).json({
        success: true,
        message: "Signup Successful",
        user
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
        success:false,
        message:"Server Error"
    });

  }
};

const login = async (req, res) => {
  try {

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const user = await User.findOne({ email });

if (!user) {
    return res.status(404).json({
        success: false,
        message: "User not found. Please Signup first."
    });
}

const now = new Date();

// First OTP request
if (!user.otpRequestWindow) {
    user.otpRequestWindow = now;
    user.otpRequestCount = 1;
}

// More than 10 minutes passed
else if (
  now - user.otpRequestWindow >
  Number(process.env.OTP_RATE_LIMIT_MINUTES) * 60 * 1000
)  {
    user.otpRequestWindow = now;
    user.otpRequestCount = 1;
}

// Still inside 10-minute window
else {

    if (user.otpRequestCount >= Number(process.env.MAX_OTP_REQUESTS)) {
        return res.status(429).json({
            success: false,
            message: "Too many OTP requests. Please try again after 10 minutes."
        });
    }

    user.otpRequestCount++;
}

// ================= RATE LIMIT END =================

// Generate OTP
const otp = String(Math.floor(100000 + Math.random() * 900000));

// OTP expires in 5 minutes
const otpExpiry = new Date(
  Date.now() + Number(process.env.OTP_EXPIRY_MINUTES) * 60 * 1000
);

// Save OTP in database
user.otp = otp;
user.otpExpiry = otpExpiry;

await user.save();

await transporter.sendMail({
  from: '"Campus Desk" <shreyansh7952@gmail.com>',
  to: email,
  subject: "CampusDesk OTP Verification",
  html: `
    <h2>CampusDesk</h2>
    <p>Your OTP is:</p>
    <h1>${otp}</h1>
    <p>This OTP is valid for 5 minutes.</p>
  `,
});

res.status(200).json({
    success: true,
    message: "OTP sent successfully to your email."
});

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};

  const verifyOTP = async (req, res) => {

  
  try {
    

    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required."
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

    if (!user.otpExpiry || new Date() > user.otpExpiry) {
    return res.status(400).json({
        success: false,
        message: "OTP Expired."
    });
}

if (user.otp !== otp) {
    return res.status(400).json({
        success: false,
        message: "Invalid OTP."
    });
}

    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    const token = user.getJWTToken();

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};

module.exports = {
    signup,
    login,
    verifyOTP
};