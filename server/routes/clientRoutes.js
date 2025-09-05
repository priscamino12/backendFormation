const express = require("express");
const router = express.Router();
const {getAllClients, createClient, updateClient, deleteClient} =  require("../controllers/clientController");
const {authMiddleware } = require("../middlewares/authMiddleware")

router.get("/",authMiddleware, getAllClients);
router.post("/",authMiddleware, createClient);
router.put("/:id",authMiddleware, updateClient);
router.delete("/:id",authMiddleware, deleteClient);

module.exports = router;
