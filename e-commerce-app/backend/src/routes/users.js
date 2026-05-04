const express = require("express");
const router = express.Router();

const { 
  getProfile, 
  updateProfile, 
  getAllUsers, 
  deleteUser 
} = require("../controllers/userController");

// Ben-call el Middlewares
const protect = require("../middleware/protect"); 
const admin = require("../middleware/admin"); 

// User Profile Routes (Matloub tekon logged in bas)
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

// Admin Routes (Matloub tekon logged in w kaman admin)
router.get("/", protect, admin, getAllUsers);
router.delete("/:id", protect, admin, deleteUser);

module.exports = router;