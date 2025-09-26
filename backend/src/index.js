import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import "dotenv/config"
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import path from "path"
import { connectDB } from "./lib/db.js"
const app = express()

const PORT = process.env.PORT || 4000

const __dirname = path.resolve()

app.use(express.json())
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(cookieParser())





app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoutes)

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")))

    app.get(/.*/, (_, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
    });

}


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta: ${PORT}`)
    connectDB()
})