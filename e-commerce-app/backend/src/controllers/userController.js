const User = require("../models/User"); 
const bcrypt = require("bcrypt"); 

const PEPPER = "mysecretpepper"; 
const SALT_ROUNDS = 10; 

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    // Beygeeb bayanat el user el 7aly mn el id elly gay mn el protect middleware
    const user = await User.findById(req.user.id).select("-password"); 
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update lel bayanat el asaseya law mab3outa
    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;

    // Law el user ba3et password gedid, ben3mel hash be nafs tariqet el Register[cite: 10]
    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password + PEPPER, SALT_ROUNDS); //[cite: 10]
    }

    const updatedUser = await user.save();

    // Benshil el password mn el result elly rag3a 3ashan el security
    updatedUser.password = undefined;

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/users/
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    // Beyraga3 kol el users (lel admin bas) w mafish da3y neraga3 el password
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getAllUsers,
  deleteUser,
};