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
