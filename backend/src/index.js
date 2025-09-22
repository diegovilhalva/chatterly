import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import "dotenv/config"
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
const app = express()

const PORT = process.env.PORT || 4000


app.use(express.json())
app.use(cors())
app.use(cookieParser())


app.get("/", (req, res) => {
    return res.send("OK")
})

app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoutes)

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta: ${PORT}`)
})