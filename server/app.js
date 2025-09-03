const express = require("express");
const dbRoutes = require("./routes/dbRoutes");
const userRoutes= require("./routes/userRoutes");
const clientRoutes = require("./routes/clientRoutes");
const app = express();
app.use(express.json());

// Routes
app.use("/api", dbRoutes);
app.use("/api/users", userRoutes);
app.use("/api/client", clientRoutes);

module.exports = app;
