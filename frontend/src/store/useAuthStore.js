import { create } from "zustand"
import { axiosInstance } from "../lib/axios"
import { toast } from "sonner"
import { io } from "socket.io-client"

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:4000" : import.meta.env.VITE_SERVER_URL

export const useAuthStore = create((set,get) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    isUploading: false,
    socket: null,
    onlineUsers:[],
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check")
            set({ authUser: res.data })
             get().connectSocket()
        } catch (error) {
            console.log("Erro no ao verificar usuário:", error)
            set({ authUser: null })
        } finally {
            set({ isCheckingAuth: false })
        }
    },
    signup: async (data) => {
        set({ isSigningUp: true })
        try {
            const res = await axiosInstance.post("/auth/sign-up", data)
            set({ authUser: res.data })
            toast.success("Conta criada com sucesso!")
             get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isSigningUp: false })
        }
    },
    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });

            toast.success("Login feito com sucesso");

            get().connectSocket()

        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLoggingIn: false });
        }
    },
    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logout feito com sucesso");
             get().disconnectSocket();
        } catch (error) {
            toast.error("Erro ao fazer logout");

        }
    },
    updateProfile: async (data) => {
        set({ isUploading: true })
        try {
            const res = await axiosInstance.put("/auth/update-profile", data)
            set({ authUser: res.data })
            toast.success("Foto de perfil atualizada")
        } catch (error) {
            console.error(error)
            toast.error(error.response?.data?.message || "Algo deu errado, tente novamente.")
        } finally {
            set({ isUploading: false })
        }
    },
    connectSocket: () => {
        const { authUser } = get()
        if (!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            withCredentials: true,
        })

        socket.connect()

        set({ socket })
        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        })
    },
    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    }
}))
