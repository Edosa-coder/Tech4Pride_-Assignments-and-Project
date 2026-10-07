const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const register = async (req, res) => {
    try {
        const { full_name, email, phone, password } = req.body;

        // Check if email or phone already exists
        const [existingUsers] = await pool.query(
            `SELECT id, email, phone
             FROM users
             WHERE email = ? OR phone = ?`,
            [email, phone]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({
                message: "Email or phone number already exists"
            });
        }

        // Hash password
        const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Create user
        const [userResult] = await pool.query(
            `INSERT INTO users
                (full_name, email, phone, password_hash)
             VALUES (?, ?, ?, ?)`,
            [full_name, email, phone, passwordHash]
        );

        // Create audit log
        const ipAddress =
            req.ip ||
            req.headers["x-forwarded-for"] ||
            req.socket.remoteAddress ||
            "unknown";

        await pool.query(
            `INSERT INTO audit_log
                (user_id, action, ip_address)
             VALUES (?, 'register', ?)`,
            [userResult.insertId, ipAddress]
        );

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: userResult.insertId,
                full_name,
                email,
                phone
            }
        });

    } catch (error) {
        console.error("Registration error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const login = async (req, res) => {
    try{
        const { email, password } = req.body;

        // Check if user exists
        const [users] = await pool.query(
            `SELECT id, full_name, email, phone, password_hash, is_active
            FROM users
            WHERE email = ?`,
            [email]
        );
        if (users.length ===0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
            }

            const user = users[0];
            // Check if user is active
            if (!user.is_active) {
                return res.status(403).json({
                    message: "User account is inactive"
                });
            }
            const passwordMatch = await bcrypt.compare(
                password, 
                user.password_hash);
            if (!passwordMatch) {
                return res.status(401).json({
                    message: "Invalid email or password"
                });
            }
            const token = jwt.sign(
                { 
                    userId: user.id,
                    email: user.email
                },
                process.env.JWT_SECRET,
                { expiresIn: "2h" }
            );
        const ipAddress =
            req.ip ||
            req.headers["x-forwarded-for"] ||
            req.socket.remoteAddress ||
            "unknown";
        await pool.query(
            `INSERT INTO audit_log
                (user_id, action, ip_address)
             VALUES (?, 'login', ?)`,
            [user.id, ipAddress]
        );

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                phone: user.phone
            }
        });
    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }   
};



module.exports = {
    register,
    login
};

