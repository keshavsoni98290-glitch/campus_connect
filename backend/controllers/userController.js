const db = require("../config/database");

// ===============================
// GET MY PROFILE
// ===============================
const getMyProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const [users] = await db.execute(
            `SELECT 
                id,
                name,
                email,
                college,
                course,
                year,
                bio,
                looking_for,
                availability,
                created_at
             FROM users
             WHERE id = ?`,
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            message: "Profile fetched successfully",
            user: users[0]
        });

    } catch (error) {
        console.error("Get profile error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ===============================
// UPDATE MY PROFILE
// ===============================
const updateMyProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const {
            name,
            college,
            course,
            year,
            bio,
            looking_for,
            availability
        } = req.body;

        const [result] = await db.execute(
            `UPDATE users
             SET
                name = ?,
                college = ?,
                course = ?,
                year = ?,
                bio = ?,
                looking_for = ?,
                availability = ?
             WHERE id = ?`,
            [
                name || null,
                college || null,
                course || null,
                year || null,
                bio || null,
                looking_for || null,
                availability || null,
                userId
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            message: "Profile updated successfully"
        });

    } catch (error) {
        console.error("Update profile error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ===============================
// GET ALL STUDENTS - DISCOVER
// ===============================
const getAllUsers = async (req, res) => {
    try {
        const userId = req.user.userId;

        const [users] = await db.execute(
            `SELECT 
                id,
                name,
                college,
                course,
                year,
                bio,
                looking_for,
                availability,
                created_at
             FROM users
             WHERE id != ?
             ORDER BY created_at DESC`,
            [userId]
        );

        res.json({
            message: "Students fetched successfully",
            users
        });

    } catch (error) {
        console.error("Get all users error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ===============================
// EXPORT FUNCTIONS
// ===============================
module.exports = {
    getMyProfile,
    updateMyProfile,
    getAllUsers
};