const express = require("express");
const dbRoutes = require("./routes/dbRoutes");
const userRoutes= require("./routes/userRoutes");
const clientRoutes = require("./routes/clientRoutes");
const authRoutes = require("./routes/authRoutes");
const participantRoutes = require("./routes/participantRoutes")
const app = express();
app.use(express.json());
const cors = require("cors");

app.use(cors());

// Routes
app.use("/api", dbRoutes);
app.use("/api/users", userRoutes);
app.use("/api/client", clientRoutes);
app.use("/api/login", authRoutes);
app.use("/api/participant", participantRoutes);

module.exports = app;
