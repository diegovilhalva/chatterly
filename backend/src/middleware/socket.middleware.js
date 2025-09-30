import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
import "dotenv/config"


export const socketAuthMiddleware = async (socket, next) => {
    try {
        const token = socket.handshake.headers.cookie?.split("; ")
            ?.find((row) => row.startsWith("jwt="))
            ?.split("=")[1]
           
        if (!token) {
            console.log("Conexão rejeitada: Token não encontrado")
            return next(new Error("Não autorizado -  Nenhum token encontrado"))
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded) {
            console.log("Token inválido ")
            return next(new Error("Token inválido"))
        }

        const user = await User.findById(decoded.userId)

        if (!user) {
            console.log("Usuário não encontrado ")
            return next(new Error("Usuário não encontrado"))
        }
        socket.user = user
        socket.userId = user._id.toString()
        next()
    } catch (error) {
        console.log(error)
        next(new Error("Ocorreu um erro na autenticação"))
    }
}