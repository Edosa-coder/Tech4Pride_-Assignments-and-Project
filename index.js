const express = require("express");
const pool = require("./db");
const router = require("./router");
require("dotenv").config();

const app = express();

app.use(express.json());

app.use("/api", router);

async function startServer() {
    try {
        await pool.query("SELECT 1");

        console.log("Database connected successfully");

        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });
    } catch (error) {
        console.error("Database connection failed:", error);
    }
}

startServer();