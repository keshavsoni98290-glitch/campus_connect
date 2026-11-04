const db = require("../config/database");

// ===============================
// SEND CONNECTION REQUEST
// ===============================
const sendConnectionRequest = async (req, res) => {
    try {
        const senderId = req.user.userId;
        const { receiverId } = req.body;

        if (!receiverId) {
            return res.status(400).json({
                message: "Receiver ID is required"
            });
        }

        if (Number(senderId) === Number(receiverId)) {
            return res.status(400).json({
                message: "You cannot connect with yourself"
            });
        }

        // Check receiver exists
        const [receiver] = await db.execute(
            "SELECT id, name FROM users WHERE id = ?",
            [receiverId]
        );

        if (receiver.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Check existing connection
        const [existing] = await db.execute(
            `SELECT id, sender_id, receiver_id, status
             FROM connections
             WHERE
             (sender_id = ? AND receiver_id = ?)
             OR
             (sender_id = ? AND receiver_id = ?)`,
            [senderId, receiverId, receiverId, senderId]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                message: "Connection already exists",
                connection: existing[0]
            });
        }

        const [result] = await db.execute(
            `INSERT INTO connections
             (sender_id, receiver_id, status)
             VALUES (?, ?, 'pending')`,
            [senderId, receiverId]
        );

        res.status(201).json({
            message: "Connection request sent successfully",
            connectionId: result.insertId
        });

    } catch (error) {
        console.error("Send connection error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ===============================
// GET MY RECEIVED REQUESTS
// ===============================
const getReceivedRequests = async (req, res) => {
    try {
        const userId = req.user.userId;

        const [requests] = await db.execute(
            `SELECT
                c.id,
                c.sender_id,
                u.name,
                u.email,
                u.college,
                u.course,
                u.year,
                c.status,
                c.created_at
             FROM connections c
             INNER JOIN users u
             ON c.sender_id = u.id
             WHERE c.receiver_id = ?
             ORDER BY c.created_at DESC`,
            [userId]
        );

        res.json({
            message: "Received requests fetched successfully",
            requests: requests
        });

    } catch (error) {
        console.error("Get received requests error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ===============================
// GET MY SENT REQUESTS
// ===============================
const getSentRequests = async (req, res) => {
    try {
        const userId = req.user.userId;

        const [requests] = await db.execute(
            `SELECT
                c.id,
                c.receiver_id,
                u.name,
                u.email,
                u.college,
                u.course,
                u.year,
                c.status,
                c.created_at
             FROM connections c
             INNER JOIN users u
             ON c.receiver_id = u.id
             WHERE c.sender_id = ?
             ORDER BY c.created_at DESC`,
            [userId]
        );

        res.json({
            message: "Sent requests fetched successfully",
            requests: requests
        });

    } catch (error) {
        console.error("Get sent requests error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ===============================
// ACCEPT CONNECTION REQUEST
// ===============================
const acceptConnectionRequest = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { connectionId } = req.params;

        const [connection] = await db.execute(
            `SELECT id, sender_id, receiver_id, status
             FROM connections
             WHERE id = ? AND receiver_id = ?`,
            [connectionId, userId]
        );

        if (connection.length === 0) {
            return res.status(404).json({
                message: "Connection request not found"
            });
        }

        if (connection[0].status !== "pending") {
            return res.status(400).json({
                message: "Connection request is not pending"
            });
        }

        await db.execute(
            `UPDATE connections
             SET status = 'accepted'
             WHERE id = ?`,
            [connectionId]
        );

        res.json({
            message: "Connection request accepted successfully"
        });

    } catch (error) {
        console.error("Accept connection error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ===============================
// REJECT CONNECTION REQUEST
// ===============================
const rejectConnectionRequest = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { connectionId } = req.params;

        const [connection] = await db.execute(
            `SELECT id, sender_id, receiver_id, status
             FROM connections
             WHERE id = ? AND receiver_id = ?`,
            [connectionId, userId]
        );

        if (connection.length === 0) {
            return res.status(404).json({
                message: "Connection request not found"
            });
        }

        if (connection[0].status !== "pending") {
            return res.status(400).json({
                message: "Connection request is not pending"
            });
        }

        await db.execute(
            `UPDATE connections
             SET status = 'rejected'
             WHERE id = ?`,
            [connectionId]
        );

        res.json({
            message: "Connection request rejected successfully"
        });

    } catch (error) {
        console.error("Reject connection error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ===============================
// GET MY ACCEPTED CONNECTIONS
// ===============================
const getMyConnections = async (req, res) => {
    try {
        const userId = req.user.userId;

        const [connections] = await db.execute(
            `SELECT
                c.id,
                u.id AS user_id,
                u.name,
                u.email,
                u.college,
                u.course,
                u.year,
                c.created_at
             FROM connections c
             INNER JOIN users u
             ON (
                 CASE
                     WHEN c.sender_id = ? THEN c.receiver_id
                     ELSE c.sender_id
                 END
             ) = u.id
             WHERE
                 (c.sender_id = ? OR c.receiver_id = ?)
                 AND c.status = 'accepted'
             ORDER BY c.created_at DESC`,
            [userId, userId, userId]
        );

        res.json({
            message: "Connections fetched successfully",
            connections: connections
        });

    } catch (error) {
        console.error("Get connections error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    sendConnectionRequest,
    getReceivedRequests,
    getSentRequests,
    acceptConnectionRequest,
    rejectConnectionRequest,
    getMyConnections
};