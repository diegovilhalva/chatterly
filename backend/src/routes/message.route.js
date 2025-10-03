import express from "express"
import { addReaction, deleteMessage, editMessage, getAllContacts, getChatPartners, getMessagesByUserID, sendMessage } from "../controllers/message.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js"
import { arcjetProtection } from "../middleware/arcjet.middleware.js"

const router = express.Router()

router.use(arcjetProtection, protectRoute)

router.get("/contacts", getAllContacts)
router.get("/chats", getChatPartners)
router.get("/:id", getMessagesByUserID)
router.post("/send/:id", sendMessage)
router.post("/reaction/:messageId",addReaction)
router.put('/edit/:messageId',editMessage)
router.delete("/:messageId",deleteMessage)

export default router