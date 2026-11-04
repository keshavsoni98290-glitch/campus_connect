const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const db = require("../config/database");


// =========================================================
// ADMIN TEST
// =========================================================

router.get(
    "/test",
    authMiddleware,
    adminMiddleware,
    (req, res) => {

        res.json({
            success: true,
            message: "Admin access granted 👑",
            user: req.user
        });

    }
);


// =========================================================
// ADMIN STATS
// =========================================================

router.get(
    "/stats",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {

        try {

            const [users] = await db.execute(
                "SELECT COUNT(*) AS totalUsers FROM users"
            );

            const [communities] = await db.execute(
                "SELECT COUNT(*) AS totalCommunities FROM communities"
            );

            const [connections] = await db.execute(
                "SELECT COUNT(*) AS totalConnections FROM connections"
            );

            const [messages] = await db.execute(
                "SELECT COUNT(*) AS totalMessages FROM messages"
            );

            return res.status(200).json({

                success: true,

                stats: {
                    totalUsers: Number(users[0].totalUsers),

                    totalCommunities:
                        Number(communities[0].totalCommunities),

                    totalConnections:
                        Number(connections[0].totalConnections),

                    totalMessages:
                        Number(messages[0].totalMessages)
                }

            });

        } catch (error) {

            console.error("ADMIN STATS ERROR:", error);

            return res.status(500).json({

                success: false,
                message: "Failed to load admin statistics",

                error: error.message

            });

        }

    }
);


// =========================================================
// USER MANAGEMENT
// GET ALL USERS
// =========================================================

router.get(
    "/users",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {

        try {

            const search =
                (req.query.search || "").trim();

            let query = `
                SELECT
                    id,
                    name,
                    email,
                    college,
                    course,
                    year,
                    role
                FROM users
            `;

            const params = [];

            if (search) {

                query += `
                    WHERE
                        name LIKE ?
                        OR email LIKE ?
                        OR college LIKE ?
                        OR course LIKE ?
                `;

                const searchValue = `%${search}%`;

                params.push(
                    searchValue,
                    searchValue,
                    searchValue,
                    searchValue
                );
            }

            query += `
                ORDER BY id DESC
            `;

            const [users] =
                await db.execute(query, params);

            return res.status(200).json({

                success: true,

                count: users.length,

                users

            });

        } catch (error) {

            console.error(
                "ADMIN USERS ERROR:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Failed to load users",

                error:
                    error.message

            });

        }

    }
);
module.exports = router;