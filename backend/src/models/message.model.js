import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    trim: true,
    maxlength: 2000,
  },
  image: {
    type: String,
  },
  status: {
    type: String,
    enum: ["sent", "delivered", "read"],
    default: "sent",
  }
}, { timestamps: true })

const Message = mongoose.model("Message", messageSchema)

export default Message
