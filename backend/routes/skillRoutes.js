const express = require("express");
const router = express.Router();

const {
    getAllSkills,
    addSkill,
    addSkillToProfile,
    getMySkills
} = require("../controllers/skillController");

const authMiddleware = require("../middleware/authMiddleware");

// GET /api/skills
router.get("/", authMiddleware, getAllSkills);

// POST /api/skills
router.post("/", authMiddleware, addSkill);

// POST /api/skills/my
router.post("/my", authMiddleware, addSkillToProfile);

// GET /api/skills/my
router.get("/my", authMiddleware, getMySkills);

module.exports = router;