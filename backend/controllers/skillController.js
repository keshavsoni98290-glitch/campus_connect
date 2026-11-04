const db = require("../config/database");

// ===============================
// GET ALL SKILLS
// ===============================
const getAllSkills = async (req, res) => {
    try {
        const [skills] = await db.execute(
            "SELECT id, name FROM skills ORDER BY name ASC"
        );

        res.json({
            message: "Skills fetched successfully",
            skills: skills
        });

    } catch (error) {
        console.error("Get skills error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ===============================
// ADD NEW SKILL
// ===============================
const addSkill = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "Skill name is required"
            });
        }

        const skillName = name.trim();

        const [existingSkill] = await db.execute(
            "SELECT id, name FROM skills WHERE name = ?",
            [skillName]
        );

        if (existingSkill.length > 0) {
            return res.status(409).json({
                message: "Skill already exists",
                skill: existingSkill[0]
            });
        }

        const [result] = await db.execute(
            "INSERT INTO skills (name) VALUES (?)",
            [skillName]
        );

        res.status(201).json({
            message: "Skill added successfully",
            skill: {
                id: result.insertId,
                name: skillName
            }
        });

    } catch (error) {
        console.error("Add skill error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ===============================
// ADD SKILL TO MY PROFILE
// ===============================
const addSkillToProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { skillId } = req.body;

        if (!skillId) {
            return res.status(400).json({
                message: "Skill ID is required"
            });
        }

        const [skill] = await db.execute(
            "SELECT id, name FROM skills WHERE id = ?",
            [skillId]
        );

        if (skill.length === 0) {
            return res.status(404).json({
                message: "Skill not found"
            });
        }

        const [existing] = await db.execute(
            "SELECT * FROM user_skills WHERE user_id = ? AND skill_id = ?",
            [userId, skillId]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                message: "Skill already added to profile"
            });
        }

        await db.execute(
            "INSERT INTO user_skills (user_id, skill_id) VALUES (?, ?)",
            [userId, skillId]
        );

        res.status(201).json({
            message: "Skill added to profile successfully",
            skill: skill[0]
        });

    } catch (error) {
        console.error("Add skill to profile error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ===============================
// GET MY SKILLS
// ===============================
const getMySkills = async (req, res) => {
    try {
        const userId = req.user.userId;

        const [skills] = await db.execute(
            `SELECT s.id, s.name
             FROM skills s
             INNER JOIN user_skills us
             ON s.id = us.skill_id
             WHERE us.user_id = ?
             ORDER BY s.name ASC`,
            [userId]
        );

        res.json({
            message: "My skills fetched successfully",
            skills: skills
        });

    } catch (error) {
        console.error("Get my skills error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    getAllSkills,
    addSkill,
    addSkillToProfile,
    getMySkills
};