const User = require("../models/model.user");
require("dotenv").config();

// @desc    Add normal user
// @route   POST /word-suggestion/v1/register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.countDocuments({ email });

    if (userExists > 0) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
        error: {
          email: "Email already exists",
        },
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: "user",
    });
    res.status(200).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// @desc    Delete specific user
// @route   DELETE /word-suggestion/v1/user
