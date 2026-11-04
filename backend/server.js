const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

console.log("JWT SECRET LOADED:", !!process.env.JWT_SECRET);

const app = express();

app.use(cors());
app.use(express.json());

// ===============================
// AUTH ROUTES
// ===============================
const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);


// ===============================
// USER ROUTES
// ===============================
const userRoutes = require("./routes/userRoutes");

app.use("/api/users", userRoutes);


// ===============================
// SKILLS ROUTES
// ===============================
const skillRoutes = require("./routes/skillRoutes");

app.use("/api/skills", skillRoutes);


// ===============================
// INTERESTS ROUTES
// ===============================
const interestRoutes = require("./routes/interestRoutes");

app.use("/api/interests", interestRoutes);


// ===============================
// GOALS ROUTES
// ===============================
const goalRoutes = require("./routes/goalRoutes");

app.use("/api/goals", goalRoutes);


// ===============================
// CONNECTION ROUTES
// ===============================
const connectionRoutes = require("./routes/connectionRoutes");

app.use("/api/connections", connectionRoutes);


// ===============================
// COMMUNITY ROUTES
// ===============================
const communityRoutes = require("./routes/communityRoutes");

app.use("/api/communities", communityRoutes);


// ===============================
// MESSAGE ROUTES
// ===============================
const messageRoutes = require("./routes/messageRoutes");

app.use("/api/messages", messageRoutes);


// ===============================
// ADMIN ROUTES
// ===============================
const adminRoutes = require("./routes/adminRoutes");

app.use("/api/admin", adminRoutes);


// ===============================
// DISCUSSION ROUTES
// ===============================
const discussionRoutes = require("./routes/discussionRoutes");

app.use("/api/discussions", discussionRoutes);


// ===============================
// EVENT ROUTES
// ===============================
const eventRoutes = require("./routes/eventRoutes");

app.use("/api/events", eventRoutes);


// ===============================
// JWT MIDDLEWARE
// ===============================
const authMiddleware = require("./middleware/authMiddleware");


// ===============================
// PROTECTED TEST ROUTE
// ===============================
app.get("/api/protected", authMiddleware, (req, res) => {
    res.json({
        message: "Protected route accessed successfully 🔐",
        user: req.user
    });
});


// ===============================
// TEST ROUTE
// ===============================
app.get("/", (req, res) => {
    res.json({
        message: "Campus Connect Backend is running 🚀"
    });
});


// ===============================
// START SERVER
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(
        `🚀 Campus Connect Backend running on http://localhost:${PORT}`
    );
});