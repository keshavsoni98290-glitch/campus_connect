const db = require("../config/database");

// CREATE EVENT
const createEvent = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { communityId } = req.params;
        const { title, date, description } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({ message: "Event title is required" });
        }

        if (!date || !date.trim()) {
            return res.status(400).json({ message: "Event date is required" });
        }

        const [community] = await db.execute(
            "SELECT id FROM communities WHERE id = ?",
            [communityId]
        );

        if (community.length === 0) {
            return res.status(404).json({ message: "Community not found" });
        }

        const [member] = await db.execute(
            `SELECT id FROM community_members
             WHERE community_id = ? AND user_id = ?`,
            [communityId, userId]
        );

        if (member.length === 0) {
            return res.status(403).json({
                message: "Join the community before creating an event"
            });
        }

        const [result] = await db.execute(
            `INSERT INTO community_events
             (community_id, created_by, title, event_date, description)
             VALUES (?, ?, ?, ?, ?)`,
            [
                communityId,
                userId,
                title.trim(),
                date.trim(),
                description && description.trim() ? description.trim() : null
            ]
        );

        res.status(201).json({
            message: "Event created successfully",
            event: {
                id: result.insertId,
                community_id: Number(communityId),
                created_by: userId,
                title: title.trim(),
                date: date.trim(),
                description: description && description.trim()
                    ? description.trim()
                    : "New community event."
            }
        });
    } catch (error) {
        console.error("Create event error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// GET EVENTS OF A COMMUNITY
const getCommunityEvents = async (req, res) => {
    try {
        const { communityId } = req.params;

        const [events] = await db.execute(
            `SELECT
                e.id,
                e.community_id,
                e.created_by,
                e.title,
                e.event_date AS date,
                e.description,
                e.created_at,
                u.name AS creator_name,
                COUNT(em.id) AS attendee_count
             FROM community_events e
             LEFT JOIN users u ON u.id = e.created_by
             LEFT JOIN event_members em ON em.event_id = e.id
             WHERE e.community_id = ?
             GROUP BY
                e.id,
                e.community_id,
                e.created_by,
                e.title,
                e.event_date,
                e.description,
                e.created_at,
                u.name
             ORDER BY e.created_at DESC`,
            [communityId]
        );

        res.json({
            message: "Community events fetched successfully",
            events
        });
    } catch (error) {
        console.error("Get events error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// JOIN EVENT
const joinEvent = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { eventId } = req.params;

        const [event] = await db.execute(
            "SELECT id, community_id FROM community_events WHERE id = ?",
            [eventId]
        );

        if (event.length === 0) {
            return res.status(404).json({ message: "Event not found" });
        }

        const [communityMember] = await db.execute(
            `SELECT id FROM community_members
             WHERE community_id = ? AND user_id = ?`,
            [event[0].community_id, userId]
        );

        if (communityMember.length === 0) {
            return res.status(403).json({
                message: "Join the community before joining this event"
            });
        }

        const [existing] = await db.execute(
            `SELECT id FROM event_members
             WHERE event_id = ? AND user_id = ?`,
            [eventId, userId]
        );

        if (existing.length > 0) {
            return res.json({ message: "Already joined", joined: true });
        }

        await db.execute(
            `INSERT INTO event_members (event_id, user_id)
             VALUES (?, ?)`,
            [eventId, userId]
        );

        res.status(201).json({
            message: "Joined event successfully",
            joined: true
        });
    } catch (error) {
        console.error("Join event error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    createEvent,
    getCommunityEvents,
    joinEvent
};
