const express = require("express");

const router = express.Router();

const {
    getMyProfile,
    updateMyProfile,
    getAllUsers
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");


// ===============================
// GET MY PROFILE
// GET /api/users/profile
// ===============================
router.get("/profile", authMiddleware, getMyProfile);


// ===============================
// UPDATE MY PROFILE
// PUT /api/users/profile
// ===============================
router.put("/profile", authMiddleware, updateMyProfile);


// ===============================
// GET ALL STUDENTS - DISCOVER
// GET /api/users
// ===============================
router.get("/", authMiddleware, getAllUsers);


module.exports = router;