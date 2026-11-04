const db = require("../config/database");

/*
=========================================================
CREATE DISCUSSION
=========================================================
*/

const createDiscussion = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { communityId, title, content } = req.body;

        if (!communityId || !title || !content) {
            return res.status(400).json({
                success: false,
                message: "Community, title and content are required."
            });
        }

        const [community] = await db.query(
            `
            SELECT id
            FROM communities
            WHERE id = ?
            AND status = 'approved'
            `,
            [communityId]
        );

        if (community.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Community not found or not approved."
            });
        }

        const [member] = await db.query(
            `
            SELECT id
            FROM community_members
            WHERE community_id = ?
            AND user_id = ?
            `,
            [communityId, userId]
        );

        if (member.length === 0) {
            return res.status(403).json({
                success: false,
                message: "Join the community before creating a discussion."
            });
        }

        const [result] = await db.query(
            `
            INSERT INTO community_discussions
            (community_id, user_id, title, content)
            VALUES (?, ?, ?, ?)
            `,
            [communityId, userId, title.trim(), content.trim()]
        );

        return res.status(201).json({
            success: true,
            message: "Discussion created successfully.",
            discussionId: result.insertId
        });

    } catch (error) {
        console.error("CREATE DISCUSSION ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Server error."
        });
    }
};


/*
=========================================================
GET COMMUNITY DISCUSSIONS
=========================================================
*/

const getCommunityDiscussions = async (req, res) => {
    try {
        const { communityId } = req.params;
        const userId = req.user.userId;

        const [discussions] = await db.query(
            `
            SELECT
                d.id,
                d.community_id,
                d.user_id,
                d.title,
                d.content,
                d.created_at,
                u.name AS user_name,

                (
                    SELECT COUNT(*)
                    FROM discussion_likes dl
                    WHERE dl.discussion_id = d.id
                ) AS like_count,

                (
                    SELECT COUNT(*)
                    FROM discussion_comments dc
                    WHERE dc.discussion_id = d.id
                ) AS comment_count,

                EXISTS (
                    SELECT 1
                    FROM discussion_likes dl2
                    WHERE dl2.discussion_id = d.id
                    AND dl2.user_id = ?
                ) AS liked_by_me

            FROM community_discussions d

            JOIN users u
                ON u.id = d.user_id

            WHERE d.community_id = ?

            ORDER BY d.created_at DESC
            `,
            [userId, communityId]
        );

        return res.json({
            success: true,
            discussions
        });

    } catch (error) {
        console.error("GET DISCUSSIONS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Server error."
        });
    }
};


/*
=========================================================
LIKE / UNLIKE DISCUSSION
=========================================================
*/

const toggleDiscussionLike = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { discussionId } = req.params;

        const [discussion] = await db.query(
            `
            SELECT id
            FROM community_discussions
            WHERE id = ?
            `,
            [discussionId]
        );

        if (discussion.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Discussion not found."
            });
        }

        const [existingLike] = await db.query(
            `
            SELECT id
            FROM discussion_likes
            WHERE discussion_id = ?
            AND user_id = ?
            `,
            [discussionId, userId]
        );

        let liked;

        if (existingLike.length > 0) {

            await db.query(
                `
                DELETE FROM discussion_likes
                WHERE discussion_id = ?
                AND user_id = ?
                `,
                [discussionId, userId]
            );

            liked = false;

        } else {

            await db.query(
                `
                INSERT INTO discussion_likes
                (discussion_id, user_id)
                VALUES (?, ?)
                `,
                [discussionId, userId]
            );

            liked = true;
        }

        const [countResult] = await db.query(
            `
            SELECT COUNT(*) AS like_count
            FROM discussion_likes
            WHERE discussion_id = ?
            `,
            [discussionId]
        );

        return res.json({
            success: true,
            liked,
            likeCount: countResult[0].like_count
        });

    } catch (error) {
        console.error("LIKE DISCUSSION ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Server error."
        });
    }
};


/*
=========================================================
GET DISCUSSION COMMENTS
=========================================================
*/

const getDiscussionComments = async (req, res) => {
    try {
        const { discussionId } = req.params;

        const [comments] = await db.query(
            `
            SELECT
                c.id,
                c.discussion_id,
                c.user_id,
                c.parent_comment_id,
                c.content,
                c.created_at,
                u.name AS user_name

            FROM discussion_comments c

            JOIN users u
                ON u.id = c.user_id

            WHERE c.discussion_id = ?

            ORDER BY c.created_at ASC
            `,
            [discussionId]
        );

        return res.json({
            success: true,
            comments
        });

    } catch (error) {
        console.error("GET COMMENTS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Server error."
        });
    }
};


/*
=========================================================
ADD COMMENT / REPLY
=========================================================
*/

const addDiscussionComment = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { discussionId } = req.params;
        const { content, parentCommentId } = req.body;

        if (!content || !content.trim()) {
            return res.status(400).json({
                success: false,
                message: "Comment cannot be empty."
            });
        }

        const [discussion] = await db.query(
            `
            SELECT community_id
            FROM community_discussions
            WHERE id = ?
            `,
            [discussionId]
        );

        if (discussion.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Discussion not found."
            });
        }

        const communityId = discussion[0].community_id;

        const [member] = await db.query(
            `
            SELECT id
            FROM community_members
            WHERE community_id = ?
            AND user_id = ?
            `,
            [communityId, userId]
        );

        if (member.length === 0) {
            return res.status(403).json({
                success: false,
                message: "Join the community before commenting."
            });
        }

        if (parentCommentId) {

            const [parent] = await db.query(
                `
                SELECT id
                FROM discussion_comments
                WHERE id = ?
                AND discussion_id = ?
                `,
                [parentCommentId, discussionId]
            );

            if (parent.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid parent comment."
                });
            }
        }

        const [result] = await db.query(
            `
            INSERT INTO discussion_comments
            (
                discussion_id,
                user_id,
                parent_comment_id,
                content
            )
            VALUES (?, ?, ?, ?)
            `,
            [
                discussionId,
                userId,
                parentCommentId || null,
                content.trim()
            ]
        );

        return res.status(201).json({
            success: true,
            message: "Comment added successfully.",
            commentId: result.insertId
        });

    } catch (error) {
        console.error("ADD COMMENT ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Server error."
        });
    }
};


module.exports = {
    createDiscussion,
    getCommunityDiscussions,
    toggleDiscussionLike,
    getDiscussionComments,
    addDiscussionComment
};