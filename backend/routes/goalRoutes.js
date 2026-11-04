const express = require("express");
const router = express.Router();

const {
    getAllGoals,
    addGoal,
    addGoalToProfile,
    getMyGoals
} = require("../controllers/goalController");

const authMiddleware = require("../middleware/authMiddleware");

// GET /api/goals
router.get("/", authMiddleware, getAllGoals);

// POST /api/goals
router.post("/", authMiddleware, addGoal);

// POST /api/goals/my
router.post("/my", authMiddleware, addGoalToProfile);

// GET /api/goals/my
router.get("/my", authMiddleware, getMyGoals);

module.exports = router;