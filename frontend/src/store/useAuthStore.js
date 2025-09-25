import { create } from "zustand"


export const useAuthStore = create((set) => ({
    authUser: { user: "john", _id: 123, age: 25 },
    isLoading:false,
    login:() => {
        console.log("Login Feito")
    }

}))
