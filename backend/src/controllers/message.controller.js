import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";


export const getAllContacts = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Erro no servidor." })
    }
}


export const getChatPartners = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // pega todas as mensagens enviadas/recebidas
    const messages = await Message.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    }).sort({ createdAt: -1 });

    // extrai os ids únicos dos parceiros de chat
    const chatPartnerIds = [
      ...new Set(
        messages.map((msg) =>
          msg.senderId.toString() === loggedInUserId.toString()
            ? msg.receiverId.toString()
            : msg.senderId.toString()
        )
      ),
    ];

    // busca os usuários correspondentes
    const chatPartners = await User.find({ _id: { $in: chatPartnerIds } }).select("-password");

    // cria um objeto para achar a última mensagem por usuário
    const lastMessagesMap = {};
    for (let msg of messages) {
      const partnerId =
        msg.senderId.toString() === loggedInUserId.toString()
          ? msg.receiverId.toString()
          : msg.senderId.toString();

      // só salva a primeira encontrada (porque já está ordenado por createdAt desc)
      if (!lastMessagesMap[partnerId]) {
        lastMessagesMap[partnerId] = msg;
      }
    }

    // monta a resposta final
    const result = chatPartners.map((partner) => ({
      _id: partner._id,
      fullName: partner.fullName,
      profilePic: partner.profilePic,
      lastMessage: lastMessagesMap[partner._id.toString()] || null,
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro no servidor." });
  }
};



export const getMessagesByUserID = async (req, res) => {
    try {

        const myId = req.user._id;
        const { id: userToChatId } = req.params;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId },
            ],
        });

        res.status(200).json(messages)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Erro no servidor." })
    }
}
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!text && !image) {
      return res.status(400).json({ message: "Por favor, insira texto ou uma imagem." });
    }

    if (senderId.equals(receiverId)) {
      return res.status(400).json({ message: "Você não pode mandar mensagens para si mesmo" });
    }

    const receiverExists = await User.exists({ _id: receiverId });
    if (!receiverExists) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    let newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
      status: "sent",
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      // entregue com sucesso
      newMessage.status = "delivered";
      await newMessage.save();

      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro no servidor." });
  }
};


export const addReaction = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: "Mensagem não encontrada" });

    message.reactions = message.reactions || [];

    // remove reação anterior do mesmo usuário
    message.reactions = message.reactions.filter(r => r.userId.toString() !== userId.toString());

    // adiciona a nova
    message.reactions.push({ userId, emoji });

    await message.save();

    // emitir a mensagem já com todas as reações atualizadas
    const payload = { messageId, reactions: message.reactions };

    const receiverSocketId = getReceiverSocketId(message.receiverId.toString());
    const senderSocketId = getReceiverSocketId(message.senderId.toString());

    if (receiverSocketId) io.to(receiverSocketId).emit("reactionAdded", payload);
    if (senderSocketId) io.to(senderSocketId).emit("reactionAdded", payload);

    res.status(200).json(payload);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao adicionar reação" });
  }
};

// controllers/message.controller.js
export const editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { text, image } = req.body;
    const userId = req.user._id;

    let message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: "Mensagem não encontrada" });

    if (message.senderId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Você não pode editar esta mensagem" });
    }

    if (text) message.text = text;
    if (image) message.image = image;

    await message.save();

    const payload = { messageId, text: message.text, image: message.image };

    const receiverSocketId = getReceiverSocketId(message.receiverId.toString());
    const senderSocketId = getReceiverSocketId(message.senderId.toString());

    if (receiverSocketId) io.to(receiverSocketId).emit("messageEdited", payload);
    if (senderSocketId) io.to(senderSocketId).emit("messageEdited", payload);

    res.status(200).json(payload);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao editar mensagem" });
  }
};


// controllers/message.controller.js
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    let message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: "Mensagem não encontrada" });

    if (message.senderId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Você não pode deletar esta mensagem" });
    }

    message.deleted = true;
    message.text = null;
    message.image = null;
    await message.save();

    const payload = { messageId };

    const receiverSocketId = getReceiverSocketId(message.receiverId.toString());
    const senderSocketId = getReceiverSocketId(message.senderId.toString());

    if (receiverSocketId) io.to(receiverSocketId).emit("messageDeleted", payload);
    if (senderSocketId) io.to(senderSocketId).emit("messageDeleted", payload);

    res.status(200).json(payload);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao deletar mensagem" });
  }
};

