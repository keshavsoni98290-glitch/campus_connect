const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/database");

// ===============================
// SIGNUP
// ===============================
const signup = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            college,
            course,
            year
        } = req.body;

        // Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        // Check if email already exists
        const [existingUser] = await db.execute(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        // role will automatically be "student"
        // because of the database DEFAULT value
        const [result] = await db.execute(
            `INSERT INTO users
            (name, email, password, college, course, year)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                name,
                email,
                hashedPassword,
                college || null,
                course || null,
                year || null
            ]
        );

        res.status(201).json({
            message: "Account created successfully",
            userId: result.insertId
        });

    } catch (error) {
        console.error("Signup error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ===============================
// LOGIN
// ===============================
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Find user
        const [users] = await db.execute(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const user = users[0];

        // Compare password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Generate JWT token
        // Role is included so backend can identify
        // whether the logged-in user is admin or student.
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.role || "student"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        // Send login response
        res.json({
            message: "Login successful",

            token: token,

            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                college: user.college,
                course: user.course,
                year: user.year,
                role: user.role || "student"
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ===============================
// EXPORT
// ===============================
module.exports = {
    signup,
    login
};