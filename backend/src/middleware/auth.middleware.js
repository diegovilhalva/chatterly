import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
import "dotenv/config"

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt 

    if (!token) {
      return res.status(401).json({ message: "Acesso negado. Faça login novamente." })
    }

    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
      return res.status(401).json({ message: "Sessão expirada ou token inválido." })
    }

    const user = await User.findById(decoded.userId).select("-password")
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." })
    }

    req.user = user
    next()
  } catch (error) {
    console.error("Erro no middleware protectRoute:", error)
    res.status(500).json({ message: "Erro no servidor ao validar autenticação." })
  }
}
