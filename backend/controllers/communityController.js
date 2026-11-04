const db = require("../config/database");

// CREATE COMMUNITY
const createCommunity = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { name, description } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "Community name is required"
            });
        }

        const communityName = name.trim();

        const [existing] = await db.execute(
            "SELECT id, name FROM communities WHERE name = ?",
            [communityName]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                message: "Community already exists",
                community: existing[0]
            });
        }

        const [result] = await db.execute(
            `INSERT INTO communities
             (name, description, created_by)
             VALUES (?, ?, ?)`,
            [
                communityName,
                description || null,
                userId
            ]
        );

        // Creator automatically becomes a member
        await db.execute(
            `INSERT INTO community_members
             (community_id, user_id)
             VALUES (?, ?)`,
            [result.insertId, userId]
        );

        res.status(201).json({
            message: "Community created successfully",
            community: {
                id: result.insertId,
                name: communityName,
                description: description || null
            }
        });

    } catch (error) {
        console.error("Create community error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// GET ALL COMMUNITIES
const getAllCommunities = async (req, res) => {
    try {
        const [communities] = await db.execute(
            `SELECT
                c.id,
                c.name,
                c.description,
                c.created_by,
                u.name AS creator_name,
                c.created_at,
                COUNT(cm.user_id) AS member_count
             FROM communities c
             LEFT JOIN users u
             ON c.created_by = u.id
             LEFT JOIN community_members cm
             ON c.id = cm.community_id
             GROUP BY
                c.id,
                c.name,
                c.description,
                c.created_by,
                u.name,
                c.created_at
             ORDER BY c.created_at DESC`
        );

        res.json({
            message: "Communities fetched successfully",
            communities: communities
        });

    } catch (error) {
        console.error("Get communities error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// JOIN COMMUNITY
const joinCommunity = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { communityId } = req.params;

        const [community] = await db.execute(
            "SELECT id, name FROM communities WHERE id = ?",
            [communityId]
        );

        if (community.length === 0) {
            return res.status(404).json({
                message: "Community not found"
            });
        }

        const [existing] = await db.execute(
            `SELECT *
             FROM community_members
             WHERE community_id = ? AND user_id = ?`,
            [communityId, userId]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                message: "Already a member of this community"
            });
        }

        await db.execute(
            `INSERT INTO community_members
             (community_id, user_id)
             VALUES (?, ?)`,
            [communityId, userId]
        );

        res.status(201).json({
            message: "Joined community successfully"
        });

    } catch (error) {
        console.error("Join community error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// GET COMMUNITY MEMBERS
const getCommunityMembers = async (req, res) => {
    try {
        const { communityId } = req.params;

        const [members] = await db.execute(
            `SELECT
                u.id,
                u.name,
                u.email,
                u.college,
                u.course,
                u.year,
                cm.joined_at
             FROM community_members cm
             INNER JOIN users u
             ON cm.user_id = u.id
             WHERE cm.community_id = ?
             ORDER BY cm.joined_at ASC`,
            [communityId]
        );

        res.json({
            message: "Community members fetched successfully",
            members: members
        });

    } catch (error) {
        console.error("Get community members error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// LEAVE COMMUNITY
const leaveCommunity = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { communityId } = req.params;

        const [result] = await db.execute(
            `DELETE FROM community_members
             WHERE community_id = ? AND user_id = ?`,
            [communityId, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "You are not a member of this community"
            });
        }

        res.json({
            message: "Left community successfully"
        });

    } catch (error) {
        console.error("Leave community error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    createCommunity,
    getAllCommunities,
    joinCommunity,
    getCommunityMembers,
    leaveCommunity
};