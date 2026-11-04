const db = require("../config/database");

// SEND MESSAGE
const sendMessage = async (req, res) => {
    try {
        const senderId = req.user.userId;
        const { receiverId, message } = req.body;

        if (!receiverId || !message || !message.trim()) {
            return res.status(400).json({
                message: "Receiver ID and message are required"
            });
        }

        if (Number(senderId) === Number(receiverId)) {
            return res.status(400).json({
                message: "You cannot message yourself"
            });
        }

        // Check receiver exists
        const [receiver] = await db.execute(
            "SELECT id FROM users WHERE id = ?",
            [receiverId]
        );

        if (receiver.length === 0) {
            return res.status(404).json({
                message: "Receiver not found"
            });
        }

        // Only accepted connections can message each other
        const [connection] = await db.execute(
            `SELECT id
             FROM connections
             WHERE
             (
                 (sender_id = ? AND receiver_id = ?)
                 OR
                 (sender_id = ? AND receiver_id = ?)
             )
             AND status = 'accepted'`,
            [senderId, receiverId, receiverId, senderId]
        );

        if (connection.length === 0) {
            return res.status(403).json({
                message: "You can only message accepted connections"
            });
        }

        // Save message
        const [result] = await db.execute(
            `INSERT INTO messages
             (sender_id, receiver_id, message)
             VALUES (?, ?, ?)`,
            [
                senderId,
                receiverId,
                message.trim()
            ]
        );

        res.status(201).json({
            message: "Message sent successfully",
            messageId: result.insertId
        });

    } catch (error) {
        console.error("Send message error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// GET CONVERSATION
const getConversation = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { userId: otherUserId } = req.params;

        if (Number(userId) === Number(otherUserId)) {
            return res.status(400).json({
                message: "Invalid conversation"
            });
        }

        const [messages] = await db.execute(
            `SELECT
                m.id,
                m.sender_id,
                m.receiver_id,
                m.message,
                m.created_at,
                sender.name AS sender_name,
                receiver.name AS receiver_name
             FROM messages m
             INNER JOIN users sender
             ON m.sender_id = sender.id
             INNER JOIN users receiver
             ON m.receiver_id = receiver.id
             WHERE
                (m.sender_id = ? AND m.receiver_id = ?)
                OR
                (m.sender_id = ? AND m.receiver_id = ?)
             ORDER BY m.created_at ASC`,
            [
                userId,
                otherUserId,
                otherUserId,
                userId
            ]
        );

        res.json({
            message: "Conversation fetched successfully",
            messages: messages
        });

    } catch (error) {
        console.error("Get conversation error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    sendMessage,
    getConversation
};