const express = require("express");
const router = express.Router();

const {
    sendConnectionRequest,
    getReceivedRequests,
    getSentRequests,
    acceptConnectionRequest,
    rejectConnectionRequest,
    getMyConnections
} = require("../controllers/connectionController");

const authMiddleware = require("../middleware/authMiddleware");

// Send connection request
router.post("/", authMiddleware, sendConnectionRequest);

// Received requests
router.get("/received", authMiddleware, getReceivedRequests);

// Sent requests
router.get("/sent", authMiddleware, getSentRequests);

// Accepted connections
router.get("/my", authMiddleware, getMyConnections);

// Accept request
router.put("/:connectionId/accept", authMiddleware, acceptConnectionRequest);

// Reject request
router.put("/:connectionId/reject", authMiddleware, rejectConnectionRequest);

module.exports = router;