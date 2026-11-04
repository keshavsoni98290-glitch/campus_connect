const express = require("express");
const router = express.Router();

const {
    createCommunity,
    getAllCommunities,
    joinCommunity,
    getCommunityMembers,
    leaveCommunity
} = require("../controllers/communityController");

const authMiddleware = require("../middleware/authMiddleware");

// Create community
router.post("/", authMiddleware, createCommunity);

// Get all communities
router.get("/", authMiddleware, getAllCommunities);

// Join community
router.post("/:communityId/join", authMiddleware, joinCommunity);

// Get community members
router.get("/:communityId/members", authMiddleware, getCommunityMembers);

// Leave community
router.delete("/:communityId/leave", authMiddleware, leaveCommunity);

module.exports = router;