const db = require("../config/database");

// ===============================
// GET ALL INTERESTS
// ===============================
const getAllInterests = async (req, res) => {
    try {
        const [interests] = await db.execute(
            "SELECT id, name FROM interests ORDER BY name ASC"
        );

        res.json({
            message: "Interests fetched successfully",
            interests: interests
        });

    } catch (error) {
        console.error("Get interests error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ===============================
// ADD NEW INTEREST
// ===============================
const addInterest = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "Interest name is required"
            });
        }

        const interestName = name.trim();

        const [existingInterest] = await db.execute(
            "SELECT id, name FROM interests WHERE name = ?",
            [interestName]
        );

        if (existingInterest.length > 0) {
            return res.status(409).json({
                message: "Interest already exists",
                interest: existingInterest[0]
            });
        }

        const [result] = await db.execute(
            "INSERT INTO interests (name) VALUES (?)",
            [interestName]
        );

        res.status(201).json({
            message: "Interest added successfully",
            interest: {
                id: result.insertId,
                name: interestName
            }
        });

    } catch (error) {
        console.error("Add interest error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ===============================
// ADD INTEREST TO MY PROFILE
// ===============================
const addInterestToProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { interestId } = req.body;

        if (!interestId) {
            return res.status(400).json({
                message: "Interest ID is required"
            });
        }

        const [interest] = await db.execute(
            "SELECT id, name FROM interests WHERE id = ?",
            [interestId]
        );

        if (interest.length === 0) {
            return res.status(404).json({
                message: "Interest not found"
            });
        }

        const [existing] = await db.execute(
            "SELECT * FROM user_interests WHERE user_id = ? AND interest_id = ?",
            [userId, interestId]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                message: "Interest already added to profile"
            });
        }

        await db.execute(
            "INSERT INTO user_interests (user_id, interest_id) VALUES (?, ?)",
            [userId, interestId]
        );

        res.status(201).json({
            message: "Interest added to profile successfully",
            interest: interest[0]
        });

    } catch (error) {
        console.error("Add interest to profile error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ===============================
// GET MY INTERESTS
// ===============================
const getMyInterests = async (req, res) => {
    try {
        const userId = req.user.userId;

        const [interests] = await db.execute(
            `SELECT i.id, i.name
             FROM interests i
             INNER JOIN user_interests ui
             ON i.id = ui.interest_id
             WHERE ui.user_id = ?
             ORDER BY i.name ASC`,
            [userId]
        );

        res.json({
            message: "My interests fetched successfully",
            interests: interests
        });

    } catch (error) {
        console.error("Get my interests error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    getAllInterests,
    addInterest,
    addInterestToProfile,
    getMyInterests
};