const User = require("../models/User"); 
const bcrypt = require("bcrypt"); 

const PEPPER = "mysecretpepper"; 
const SALT_ROUNDS = 10; 


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

const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update lel bayanat el asaseya law mab3outa
    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;

    // --- NEW PASSWORD LOGIC ---
    if (req.body.newPassword) {
      // 1. Check if the user provided their old password
      if (!req.body.oldPassword) {
        return res.status(400).json({ message: "Current password is required to set a new one." });
      }

      // 2. Verify the old password matches what is in the database
      const isMatch = await bcrypt.compare(req.body.oldPassword + PEPPER, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect current password." });
      }

      // 3. Hash and set the new password
      user.password = await bcrypt.hash(req.body.newPassword + PEPPER, SALT_ROUNDS);
    }
    // --------------------------

    const updatedUser = await user.save();

    // Benshil el password mn el result elly rag3a 3ashan el security
    updatedUser.password = undefined;

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    // Beyraga3 kol el users (lel admin bas) w mafish da3y neraga3 el password
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

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