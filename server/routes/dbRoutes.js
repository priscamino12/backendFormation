const express = require("express");
const router = express.Router();
const { setupDatabase } = require("../controllers/dbController");

router.get("/db", async (req, res) => {
  const result = await setupDatabase();
  res.json(result);
});

module.exports = router;
