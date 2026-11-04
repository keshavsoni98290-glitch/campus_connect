const express = require("express");
const router = express.Router();

const {
    createEvent,
    getCommunityEvents,
    joinEvent
} = require("../controllers/eventController");

const authMiddleware = require("../middleware/authMiddleware");

// CREATE EVENT
router.post("/community/:communityId", authMiddleware, createEvent);

// GET COMMUNITY EVENTS
router.get("/community/:communityId", authMiddleware, getCommunityEvents);

// JOIN EVENT
router.post("/:eventId/join", authMiddleware, joinEvent);

module.exports = router;