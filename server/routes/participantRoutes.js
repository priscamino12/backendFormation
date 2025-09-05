const express = require("express");
const router = express.Router();
const {getAllParticipants,getParticipantById, searchParticipants, createParticipant, updateParticipant,deleteParticipant} = require("../controllers/participantController");
const {authMiddleware} = require("../middlewares/authMiddleware")

router.get("/", authMiddleware, getAllParticipants);
router.post("/", authMiddleware, createParticipant);
router.put("/:id", authMiddleware, updateParticipant);
router.delete("/:id", authMiddleware, deleteParticipant);
router.get("/:id", authMiddleware, getParticipantById);
router.get("/search", authMiddleware, searchParticipants);



module.exports = router;