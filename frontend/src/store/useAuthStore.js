import { create } from "zustand"
import { axiosInstance } from "../lib/axios"
import { toast } from "sonner"

export const useAuthStore = create((set) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    isUploading: false,
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check")
            set({ authUser: res.data })

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
            toast.success("Conta criado com sucesso!")

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

        } catch (error) {
            toast.error("Error logging out");

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
    }
}))
