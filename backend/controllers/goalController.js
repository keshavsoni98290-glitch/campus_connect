const db = require("../config/database");

// ===============================
// GET ALL GOALS
// ===============================
const getAllGoals = async (req, res) => {
    try {
        const [goals] = await db.execute(
            "SELECT id, name FROM goals ORDER BY name ASC"
        );

        res.json({
            message: "Goals fetched successfully",
            goals: goals
        });

    } catch (error) {
        console.error("Get goals error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ===============================
// ADD NEW GOAL
// ===============================
const addGoal = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "Goal name is required"
            });
        }

        const goalName = name.trim();

        const [existingGoal] = await db.execute(
            "SELECT id, name FROM goals WHERE name = ?",
            [goalName]
        );

        if (existingGoal.length > 0) {
            return res.status(409).json({
                message: "Goal already exists",
                goal: existingGoal[0]
            });
        }

        const [result] = await db.execute(
            "INSERT INTO goals (name) VALUES (?)",
            [goalName]
        );

        res.status(201).json({
            message: "Goal added successfully",
            goal: {
                id: result.insertId,
                name: goalName
            }
        });

    } catch (error) {
        console.error("Add goal error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ===============================
// ADD GOAL TO MY PROFILE
// ===============================
const addGoalToProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { goalId } = req.body;

        if (!goalId) {
            return res.status(400).json({
                message: "Goal ID is required"
            });
        }

        const [goal] = await db.execute(
            "SELECT id, name FROM goals WHERE id = ?",
            [goalId]
        );

        if (goal.length === 0) {
            return res.status(404).json({
                message: "Goal not found"
            });
        }

        const [existing] = await db.execute(
            "SELECT * FROM user_goals WHERE user_id = ? AND goal_id = ?",
            [userId, goalId]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                message: "Goal already added to profile"
            });
        }

        await db.execute(
            "INSERT INTO user_goals (user_id, goal_id) VALUES (?, ?)",
            [userId, goalId]
        );

        res.status(201).json({
            message: "Goal added to profile successfully",
            goal: goal[0]
        });

    } catch (error) {
        console.error("Add goal to profile error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ===============================
// GET MY GOALS
// ===============================
const getMyGoals = async (req, res) => {
    try {
        const userId = req.user.userId;

        const [goals] = await db.execute(
            `SELECT g.id, g.name
             FROM goals g
             INNER JOIN user_goals ug
             ON g.id = ug.goal_id
             WHERE ug.user_id = ?
             ORDER BY g.name ASC`,
            [userId]
        );

        res.json({
            message: "My goals fetched successfully",
            goals: goals
        });

    } catch (error) {
        console.error("Get my goals error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    getAllGoals,
    addGoal,
    addGoalToProfile,
    getMyGoals
};