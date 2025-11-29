require("dotenv").config();
const express = require("express");
const app = express();
const db = require("../src/config/database");
const cors = require("cors");

app.use(express.json());

// Routes
app.use(cors());
app.use("/api/auth", require("../src/routes/authRoutes"));
// Export untuk Vercel, bukan listen
module.exports = app;
