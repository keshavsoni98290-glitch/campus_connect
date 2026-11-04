const express = require("express");
const router = express.Router();

const {
    getAllInterests,
    addInterest,
    addInterestToProfile,
    getMyInterests
} = require("../controllers/interestController");

const authMiddleware = require("../middleware/authMiddleware");

// GET /api/interests
router.get("/", authMiddleware, getAllInterests);

// POST /api/interests
router.post("/", authMiddleware, addInterest);

// POST /api/interests/my
router.post("/my", authMiddleware, addInterestToProfile);

// GET /api/interests/my
router.get("/my", authMiddleware, getMyInterests);

module.exports = router;