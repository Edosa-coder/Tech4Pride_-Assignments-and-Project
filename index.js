
require("dotenv").config();

const express = require("express");
const pool = require("./db");
const router = require("./router");

const app = express();

app.use(express.json());

app.use("/api", router);

// Local development only
if (require.main === module && process.env.VERCEL !== "1") {
    async function startServer() {
        try {
            await pool.query("SELECT 1");

            console.log("Database connected successfully");

            const PORT = process.env.PORT || 8080;

            app.listen(PORT, () => {
                console.log(`Server running on port ${PORT}`);
            });
        } catch (error) {
            console.error("Database connection failed:", error);
            process.exit(1);
        }
    }

    startServer();
}

// Export Express app for Vercel
module.exports = app;
