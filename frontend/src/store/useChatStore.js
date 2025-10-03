import { create } from "zustand"
import { axiosInstance } from "../lib/axios"
import { toast } from "sonner"
import { useAuthStore } from "./useAuthStore"

export const useChatStore = create((set, get) => ({
    allContacts: [],
    chats: [],
    messages: [],
    activeTab: "chats",
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isSoundEnabled: localStorage.getItem("isSoundEnabled") === true,

    toggleSound: () => {
        localStorage.setItem("isSoundEnabled", !get().isSoundEnabled)
        set({ isSoundEnabled: !get().isSoundEnabled })
    },
    setActiveTab: (tab) => set({ activeTab: tab }),
    setSelectedUser: (selectedUser) => set({ selectedUser: selectedUser }),
    getAllContacts: async () => {
        set({ isUsersLoading: true })
        try {
            const res = await axiosInstance.get("/message/contacts")
            set({ allContacts: res.data })
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isUsersLoading: false })
        }
    },

    getMyChatPartners: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/message/chats");
            set({ chats: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },
    getMessagesByUserId: async (userId) => {
        set({ isMessagesLoading: true })
        try {
            const res = await axiosInstance.get(`/message/${userId}`)
            set({ messages: res.data })
        } catch (error) {
            toast(error.response.data.message)
        } finally {
            set({ isMessagesLoading: false })
        }

    },
    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get()
        const { authUser } = useAuthStore.getState()
        const tempId = `temp-${Date.now()}`
        const optimisticMessage = {
            _id: tempId,
            senderId: authUser._id,
            receiverId: selectedUser._id,
            text: messageData.text,
            image: messageData.image,
            createdAt: new Date().toISOString(),
            isOptimistic: true,
        };
        set({ messages: [...messages, optimisticMessage] })
        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData)
            set({ messages: messages.concat(res.data) })
        } catch (error) {
            set({ messages: messages })
            toast.error(error.response?.data?.message || "Ocorreu um erro")
        }
    },
    addReactionToMessage: async (messageId, emoji) => {
        const { selectedUser } = get();
        const socket = useAuthStore.getState().socket;

        try {
            await axiosInstance.post(`/message/reaction/${messageId}`, { emoji });
            // emite via socket para outro usuário
            socket.emit("reactionAdded", { messageId, emoji, toUserId: selectedUser._id });
        } catch (err) {
            toast.error("Erro ao enviar reação");
        }
    },

    subscribeToMessages: async () => {
        const { selectedUser, isSoundEnabled } = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        // receber mensagens novas
        socket.on("newMessage", (newMessage) => {
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
            if (!isMessageSentFromSelectedUser) return;

            const currentMessages = get().messages;
            const updatedMessages = [...currentMessages, newMessage];
            set({ messages: updatedMessages });


            socket.emit("markAsRead", { fromUserId: selectedUser._id });

            if (isSoundEnabled) {
                const notificationSound = new Audio("/sounds/notification.mp3");
                notificationSound.currentTime = 0;
                notificationSound.play().catch((e) => console.log("Audio play failed:", e));
            }
        });

        socket.on("reactionAdded", ({ messageId, reactions }) => {
            const { messages } = get();
            const updated = messages.map((m) =>
                m._id === messageId ? { ...m, reactions } : m
            );
            set({ messages: updated });
        });



        socket.on("messagesRead", ({ readerId }) => {
            const { messages } = get();
            const updated = messages.map((m) =>
                m.receiverId === readerId ? { ...m, status: "read" } : m
            );
            set({ messages: updated });
        });
    },


    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
        socket.off("messagesRead");
    },


}))