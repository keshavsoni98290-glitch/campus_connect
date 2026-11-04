const express = require("express");

const router = express.Router();

const {
    createDiscussion,
    getCommunityDiscussions,
    toggleDiscussionLike,
    getDiscussionComments,
    addDiscussionComment
} = require("../controllers/discussionController");

const authMiddleware = require("../middleware/authMiddleware");

// Create discussion
router.post("/", authMiddleware, createDiscussion);

// Get discussions of a community
router.get("/community/:communityId", authMiddleware, getCommunityDiscussions);

// Like / Unlike discussion
router.post("/:discussionId/like", authMiddleware, toggleDiscussionLike);

// Get comments of a discussion
router.get("/:discussionId/comments", authMiddleware, getDiscussionComments);

// Add comment / reply
router.post("/:discussionId/comments", authMiddleware, addDiscussionComment);

module.exports = router;