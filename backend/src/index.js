import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import "dotenv/config"
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import { connectDB } from "./lib/db.js"
import { app, server } from "./lib/socket.js"


const PORT = process.env.PORT || 4000


app.use(express.json({limit:"5mb"}))
app.set("trust proxy", 1);
const allowedOrigins = [
    "http://localhost:5173",
    process.env.CLIENT_URL, 
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true); 
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
}));

app.use(cookieParser())


app.get("/", (req, res) => {
    res.send("Servidor ok")
})



app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoutes)




server.listen(PORT, () => {
    console.log(`Servidor rodando na porta: ${PORT}`)
    connectDB()
})