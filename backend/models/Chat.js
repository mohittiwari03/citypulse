import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ["user", "assistant"], required: true },
  content: { type: String, required: true },
});

const chatSchema = new mongoose.Schema(
  {
    city: { type: String, default: "" },
    messages: [messageSchema],
    user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
    },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
